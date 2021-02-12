import {
  ArcCurve,
  Geometry
} from 'three';

import {
  Arc2,
  Vector3,
  MeshBuilder
} from 'babylonjs';

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
    endAngle
  );
    
  const points = curve.getPoints(32);
  const geometry = new Geometry().setFromPoints(points);

  let arc = BABYLON.MeshBuilder.CreateLines(entity.props.handle, {
    useVertexAlpha: false,
    points: geometry.vertices
  });
  
  arc.color = entity.getColor();
  arc.position.x = entity.props.center.x;
  arc.position.y = entity.props.center.y;
  arc.position.z = entity.props.center.z;

  return arc;
}

export default Arc;