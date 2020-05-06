export default (offsetCurve) => {
  const { curves } = offsetCurve;
  const curvesPoints = curves.map((curve) => curve.points);
  const m = `M${curvesPoints[0][0].x},${curvesPoints[0][0].y} `;
  const cPoints = curvesPoints.map((curve) => curve.filter((array, index) => index !== 0));
  const c = cPoints.reduce((total, pointSet) => {
    return `${total}${pointSet.reduce((cTot, points) => {
      return `${cTot}${points.x},${points.y} `;
    }, 'C')}`;
  }, '');
  return m + c;
};
