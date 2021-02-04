import {
  ArcCurve,
  BufferGeometry,
  LineBasicMaterial,
  Line
} from 'three';

const Arc = (entity) => {
  let startAngle, endAngle;

  if (entity.type === 'CIRCLE') {
    startAngle = entity.props.startAngle || 0;
    endAngle = startAngle + 2 * Math.PI;
  } else {
    startAngle = entity.props.startAngle;
    endAngle = entity.props.endAngle;
  }

  const curve = new ArcCurve(
    0, 0,
    entity.props.radius,
    startAngle,
    endAngle);

  const points = curve.getPoints(32);
  const geometry = new BufferGeometry().setFromPoints(points);

  const material = new LineBasicMaterial({
    color: entity.getColor()
  });

  const arc = new Line(geometry, material);
  arc.position.x = entity.props.center.x;
  arc.position.y = entity.props.center.y;
  arc.position.z = entity.props.center.z;

  return arc;
}

export default Arc;