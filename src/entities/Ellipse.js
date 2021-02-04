import {
  EllipseCurve,
  BufferGeometry,
  LineBasicMaterial,
  Line
} from 'three';

const Ellipse = (entity) => {
  const color = entity.getColor();

  const xrad = Math.sqrt(Math.pow(entity.props.majorAxisEndPoint.x, 2) + Math.pow(entity.props.majorAxisEndPoint.y, 2));
  const yrad = xrad * entity.props.axisRatio;
  const rotation = Math.atan2(entity.props.majorAxisEndPoint.y, entity.props.majorAxisEndPoint.x);

  const curve = new EllipseCurve(
    entity.props.center.x, entity.props.center.y,
    xrad, yrad,
    entity.props.startAngle, entity.props.endAngle,
    false, // Always counterclockwise
    rotation
  );

  const points = curve.getPoints(50);
  const geometry = new BufferGeometry().setFromPoints(points);
  const material = new LineBasicMaterial({
    linewidth: 1,
    color: color
  });

  // Create the final object to add to the scene
  const ellipse = new Line(geometry, material);

  return ellipse;
}

export default Ellipse;