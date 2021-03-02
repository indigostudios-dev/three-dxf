import {
  Vector3
} from '@babylonjs/core';

const Arc = (entity) => {
  const name = entity.props.handle;
  const color = entity.getColor();
  const radius = entity.props.radius;
  const startAngle = entity.props.startAngle;
  const endAngle = entity.props.endAngle;
  const angleLength = entity.props.angleLength;
  const midAngle = startAngle > endAngle
    ? ((Math.PI * 2 - startAngle + endAngle) / 2 + startAngle) % (Math.PI * 2)
    : (endAngle - startAngle) / 2 + startAngle;
  
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

    const midPoint = {
      x: radius * Math.cos(midAngle),
      y: radius * Math.sin(midAngle)
    }

    const endPoint = {
      x: radius * Math.cos(endAngle),
      y: radius * Math.sin(endAngle)
    }

    path = new BABYLON.Path2(startPoint.x, startPoint.y)
      .addArcTo(midPoint.x, midPoint.y, endPoint.x, endPoint.y, 32);
  }

  const points = path.getPoints().map(point => new Vector3(point.x, point.y, 0));

  // const arc = BABYLON.MeshBuilder.CreateLines(entity.props.handle, {
  //   useVertexAlpha: false,
  //   points: points
  // });
  
  // arc.color = color;
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