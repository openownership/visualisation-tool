// This function takes a curve 
// (defined by the return object from https://pomax.github.io/bezierjs) 
// and extracts the associated points. 
// It then builds an SVG object from those points.
export default (offsetCurve) => {
  const { curves } = offsetCurve;
  // Extract the points
  const curvesPoints = curves.map((curve) => curve.points);
  // Define the starting point (M)
  const m = `M${curvesPoints[0][0].x},${curvesPoints[0][0].y} `;
  // Get just the C points
  const cPoints = curvesPoints.map((curve) => curve.filter((array, index) => index !== 0));
  // Build the C object based on the points
  const c = cPoints.reduce((total, pointSet) => {
    return `${total}${pointSet.reduce((cTot, points) => {
      return `${cTot}${points.x},${points.y} `;
    }, 'C')}`;
  }, '');
  // Combine the starting point and curve definitions
  return m + c;
};
