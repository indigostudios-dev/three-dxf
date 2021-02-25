import {
  Path2,
  Vector3
} from '@babylonjs/core/Legacy/legacy';

const Arc = (entity) => {
  const name = entity.props.handle;
  const color = entity.getColor();
  const radius = entity.props.radius;
  const startAngle = entity.props.startAngle;
  const endAngle = entity.props.endAngle;
  const angleLength = entity.props.angleLength;

  const direction = -angleLength / Math.abs(angleLength);

  let path;

  if (entity.type === 'CIRCLE') {
    path = new BABYLON.Path2(radius, 0)
      .addArcTo(0, radius, -radius, 0, 16)
      .addArcTo(0,-radius, radius, 0, 16)
  } else {
    const startPoint = {
      x: radius * Math.cos(startAngle),
      y: radius * Math.sin(startAngle)
    }

    const endPoint = {
      x: radius * Math.cos(endAngle),
      y: radius * Math.sin(endAngle)
    }

    path = new BABYLON.Path2(startPoint.x, startPoint.y)
      .addArcTo(radius * direction, 0, endPoint.x, endPoint.y, 32)
  }

  const points = path.getPoints().map(point => new Vector3(point.x, point.y, 0));


  // let arc = BABYLON.MeshBuilder.CreateLines(entity.props.handle, {
  //   useVertexAlpha: false,
  //   points: geometry.vertices
  // });
  
  // arc.color = entity.getColor();
  // arc.position.x = entity.props.center.x;
  // arc.position.y = entity.props.center.y;
  // arc.position.z = entity.props.center.z;

  return {
    type: 'Line',
    name,
    points,
    color,
    position: entity.props.center
  };
}

export default Arc;