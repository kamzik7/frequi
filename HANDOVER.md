# Handover: FreqUI chart markers and mobile layout

State as of 2026-10-14. Local-only file on branch `local/karel`; not part of any upstream PR.

## Goal

Make FreqUI's trade markers readable for the Freqtrade bot on this VM (container `freqtrade`,
compose project `~/freqtrade`, UI on `127.0.0.1:8080`, reached via
https://basilisk-sparrow.exe.xyz:8080/), keep the patch small enough to offer upstream,
and serve the result from the bot. Later added: a compact chart layout for phones.

## Repository and branches

- Clone: `~/src/frequi`. `origin` = fork `kamzik7/frequi`, `upstream` = `freqtrade/frequi`.
- Nothing is pushed to the fork yet.

| Branch | Commit | Content | Meant for |
| --- | --- | --- | --- |
| `feat/configurable-chart-markers` | `4a4ae2ab` | Settings for symbol, size, color of entry/exit markers (signals and trade fills), optional scaling with zoom. Defaults equal the old look. 7 files, +256/-25, 2 unit tests. | Upstream PR |
| `feat/mobile-chart` | `bccae9ad` | Up to the `md` breakpoint: tap-only readout instead of the floating tooltip, secondary controls in a drawer, legend / zoom slider / trade labels hidden (switches in the drawer), full-width chart. 5 files, +191/-49. Branched from `main`. | Upstream PR |
| `local/karel` | this file | Merge of both, plus local-only defaults: larger markers (signals 16/14, trades 22), bright colors (#00ff26, #ffe600, #00e5ff, #ff4dff), markers drawn above candles with a black outline, zoom scaling off. | The build served to Karel |

## Toolchain

- Node 22.23.3 in `~/.local/node22` (not on PATH by default): `export PATH=$HOME/.local/node22/bin:$PATH`.
- pnpm 11.25.0 via corepack (pinned by `packageManager` in `package.json`); `pnpm install --frozen-lockfile`.
- Checks as in CI: `pnpm run lint-ci`, `pnpm run build`, then `pnpm run typecheck` (it needs the
  auto-import types the build generates), `pnpm exec vitest run`.
- Browser tests: the repo's `chromium` project uses `channel: 'chrome'`, which is not installed.
  Use a throwaway config with `devices['Desktop Chrome']` and no channel, keep the project name
  `chromium` so the reference screenshots match, and pass `--reporter=list` (the default HTML
  reporter opens a server on failure). Playwright Chromium build 1243 is in `~/.cache/ms-playwright`;
  the older 1208 builds there are unused and can be deleted.

## Deployment (not done)

The bot still serves its built-in UI: the container has only the `user_data` mount (checked
2026-10-14). `dist/` currently holds a build of `local/karel`. To serve it, add under `volumes:`
in `~/freqtrade/docker-compose.yml`:

```yaml
      - "/home/exedev/src/frequi/dist:/freqtrade/freqtrade/rpc/api_server/ui/installed:ro"
```

then `cd ~/freqtrade && docker compose up -d` (a plain restart does not pick up mounts).

- The path comes from `freqtrade/rpc/api_server/web_ui.py` in the container.
- The bot reports API 2.50; this UI build gates features on versions up to 2.49.
- `pnpm run build` empties `dist/` but keeps the directory, so a rebuild shows after a page reload.
  If `dist/` itself is deleted, recreate the container.
- Without `.uiversion` in `dist/` the settings page shows the UI version as "not_installed-<hash>".

## Preview server

`vite preview` ran on `127.0.0.1:3000` (reached via https://basilisk-sparrow.exe.xyz:3000/,
`/api` proxied to the bot) from 2026-10-03 to 2026-10-14 and was stopped at handover.
To start it again (ask Karel first, port rule):

```sh
cd ~/src/frequi && export PATH=$HOME/.local/node22/bin:$PATH
__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS=basilisk-sparrow.exe.xyz pnpm exec vite preview --host 127.0.0.1 --port 3000 --strictPort
```

Browser storage is per origin, so settings and plot configs on :3000 are separate from :8080.

## Open items

1. Push the two `feat/` branches to the fork and open the upstream PRs (only on Karel's word).
2. Apply the compose mount above and restart the bot (Karel runs the restart).
3. Strategy `plot_config` for SMA lines: not added. Editing `~/freqtrade/user_data/strategies/SmaCross.py`
   was blocked by the permission check. The snippet (after `startup_candle_count = 50`):
   `plot_config = {"main_plot": {"sma_fast": {"color": "#2196f3"}, "sma_slow": {"color": "#ff9800"}}}`.
   FreqUI then loads it per browser via plot configurator, "From strategy", "Save".
   Without it, paste this in the plot configurator ("Show", "Load from string below", "Save"):
   `{"main_plot":{"sma_fast":{"color":"#2196f3"},"sma_slow":{"color":"#ff9800"}},"subplots":{}}`
4. Bot API password: the old one was shown in the chat. Changing it in `config.json` was blocked
   by the permission check, so Karel was given the steps; whether he did it is not recorded here.
5. Mobile layout, known trade-offs: price labels inside the chart can overlap the newest candles,
   subplot names are hidden on phones, crossing the 768 px breakpoint rebuilds the chart and resets zoom.

## Notes on the bot

SmaCross (SMA20/SMA50 crossover, long only, dry run, 5m candles) was losing on BTC/USDT
(8 trades 2026-09-30 to 2026-10-03, about -3.2 % in sum). The strategy file says it was
backtested on 1d candles; running live on 1h or 1d would match that.
