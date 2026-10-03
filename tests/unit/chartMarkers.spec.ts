import { describe, it, expect } from 'vitest';
import { chartMarkerSymbol, chartMarkerZoomScale } from '@/utils/charts/tradeChartData';

describe('chartMarkers', () => {
  it('resolves the default symbol', () => {
    expect(chartMarkerSymbol({ symbol: 'default', size: 10, color: '' }, 'triangle')).toEqual(
      'triangle',
    );
    expect(chartMarkerSymbol({ symbol: 'circle', size: 10, color: '' }, 'triangle')).toEqual(
      'circle',
    );
  });
  it('scales markers with zoom', () => {
    expect(chartMarkerZoomScale(250, 250)).toEqual(1);
    expect(chartMarkerZoomScale(250, 125)).toEqual(2);
    expect(chartMarkerZoomScale(250, 333)).toEqual(0.8);
    // Limits
    expect(chartMarkerZoomScale(250, 10)).toEqual(4);
    expect(chartMarkerZoomScale(250, 2000)).toEqual(0.5);
    expect(chartMarkerZoomScale(250, 0)).toEqual(1);
  });
});
