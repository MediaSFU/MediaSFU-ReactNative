import { calculateEmbeddedLayout } from '../src/utils/embeddedLayout';

describe('embedded layout boundary', () => {
  it('preserves full-window defaults', () => {
    expect(calculateEmbeddedLayout({ boundary: { width: 1500, height: 900 } }))
      .toEqual({ width: 1500, height: 900 });
  });

  it('never exceeds a measured 1294px host', () => {
    for (const boundaryName of ['MainContainer', 'MainAspect', 'MainScreen']) {
      const result = calculateEmbeddedLayout({ boundary: { width: 1294, height: 720 } });
      expect({ boundaryName, fits: result.width <= 1294 }).toEqual({ boundaryName, fits: true });
    }
  });

  it('updates every boundary after a host resize', () => {
    expect(calculateEmbeddedLayout({ boundary: { width: 1036, height: 640 }, contentHeightFraction: 0.9 }))
      .toEqual({ width: 1036, height: 576 });
  });
});


