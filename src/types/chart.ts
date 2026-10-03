export interface CumProfitData {
  [date: string]: number;
  profit: number;
}

export interface CumProfitDataPerDate {
  [key: number]: CumProfitData;
}

export type CumProfitChartData = {
  date: number;
  profit?: number;
  currentProfit?: number;
};

export interface ChartSliderPosition {
  startValue: number;
  endValue: number | undefined;
}

export interface ChartMarkerStyle {
  /** ECharts symbol name. 'default' keeps the built-in symbol. */
  symbol: string;
  size: number;
  /** Empty string keeps the built-in color. */
  color: string;
}

export interface ChartMarkerSettings {
  signalEntry: ChartMarkerStyle;
  signalExit: ChartMarkerStyle;
  tradeEntry: ChartMarkerStyle;
  tradeExit: ChartMarkerStyle;
  /** Scale marker sizes with the chart zoom level */
  scaleWithZoom: boolean;
}
