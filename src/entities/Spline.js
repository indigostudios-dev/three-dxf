// import {
//   Vector2,
//   QuadraticBezierCurve,
//   QuadraticBezierCurve3,
//   SplineCurve,
//   BufferGeometry,
//   LineBasicMaterial,
//   Line
// } from 'three';

// const Spline = (entity) => {
//   const color = entity.getColor();

//   const points = entity.props.controlPoints.map(function (vec) {
//     return new Vector2(vec.x, vec.y);
//   });

//   const interpolatedPoints = [];
//   let curve;

//   if (entity.props.degreeOfSplineCurve === 2 || entity.props.degreeOfSplineCurve === 3) {
//     let i = 0
//     for (i = 0; i + 2 < points.length; i = i + 2) {
//       if (entity.props.degreeOfSplineCurve === 2) {
//         curve = new QuadraticBezierCurve(points[i], points[i + 1], points[i + 2]);
//       } else {
//         curve = new QuadraticBezierCurve3(points[i], points[i + 1], points[i + 2]);
//       }
//       interpolatedPoints.push.apply(interpolatedPoints, curve.getPoints(50));
//     }
//     if (i < points.length) {
//       curve = new QuadraticBezierCurve3(points[i], points[i + 1], points[i + 1]);
//       interpolatedPoints.push.apply(interpolatedPoints, curve.getPoints(50));
//     }
//   } else {
//     curve = new SplineCurve(points);
//     interpolatedPoints = curve.getPoints(100);
//   }

//   const geometry = new BufferGeometry().setFromPoints(interpolatedPoints);
//   const material = new LineBasicMaterial({
//     linewidth: 1,
//     color: color
//   });
//   const splineObject = new Line(geometry, material);

//   return splineObject;
// }

// export default Spline;