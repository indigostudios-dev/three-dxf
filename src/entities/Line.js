import {
  Vector3,
  MeshBuilder
} from 'babylonjs';

import BulgeGeometry from '../BulgeGeometry';

const Line = (entity) => {
  const color = entity.getColor(),
        points = [];

  if (!entity.props.vertices) return console.log('entity missing vertices.');

  const lineType = entity.props.lineType ? entity.source.tables.lineType.lineTypes[entity.props.lineType] : null;

  // create geometry
  for (let i = 0; i < entity.props.vertices.length; i++) {
    const vertex = entity.props.vertices[i];

    if (vertex.bulge) {
      const bulge = vertex.bulge;
      const startPoint = vertex;
      const endPoint = i + 1 < entity.props.vertices.length ? entity.props.vertices[i + 1] : points[0];
      const bulgeGeometry = new BulgeGeometry(startPoint, endPoint, bulge);
      
      points.push.apply(points, bulgeGeometry.vertices);
    } else {
      points.push(new Vector3(vertex.x, vertex.y, 0));
    }
  }

  if (entity.props.shape) points.push(points[0]);

  let line;
  if (lineType && lineType.pattern && lineType.pattern.length !== 0) {
    line =  BABYLON.MeshBuilder.CreateDashedLines("lines", {    
      points,
      dashSize: 4,
      gapSize: 4,
    });

    line.color = color;
  } else {
    line = BABYLON.MeshBuilder.CreateLines("lines", {
      points
    });
    line.color = color;
  }

  return line;
}

export default Line;