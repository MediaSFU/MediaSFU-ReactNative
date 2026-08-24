export type EmbeddedLayoutBoundary = { width: number; height: number };

export const calculateEmbeddedLayout = ({
  boundary,
  widthFraction = 1,
  heightFraction = 1,
  contentHeightFraction = 1,
}: {
  boundary: EmbeddedLayoutBoundary;
  widthFraction?: number;
  heightFraction?: number;
  contentHeightFraction?: number;
}): EmbeddedLayoutBoundary => ({
  width: Math.max(0, Math.floor(boundary.width * widthFraction)),
  height: Math.max(0, Math.floor(boundary.height * heightFraction * contentHeightFraction)),
});
