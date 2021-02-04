import {
  Line as ThreeLine,
  Geometry,
  Vector3,
  LineDashedMaterial,
  LineBasicMaterial
} from 'three';

import BulgeGeometry from '../BulgeGeometry';

const Line = (entity) => {
  const geometry = new Geometry(),
        color = entity.getColor();

  let lineType;

  if (!entity.props.vertices) return console.log('entity missing vertices.');

  // create geometry
  for (let i = 0; i < entity.props.vertices.length; i++) {

    if (entity.props.vertices[i].bulge) {
      const bulge = entity.props.vertices[i].bulge;
      const startPoint = entity.props.vertices[i];
      const endPoint = i + 1 < entity.props.vertices.length ? entity.props.vertices[i + 1] : geometry.vertices[0];

      const bulgeGeometry = new BulgeGeometry(startPoint, endPoint, bulge);

      geometry.vertices.push.apply(geometry.vertices, bulgeGeometry.vertices);
    } else {
      const vertex = entity.props.vertices[i];
      geometry.vertices.push(new Vector3(vertex.x, vertex.y, 0));
    }

  }

  if (entity.props.shape) geometry.vertices.push(geometry.vertices[0]);

  // set material
  if (entity.props.lineType) {
    lineType = data.tables.lineType.lineTypes[entity.props.lineType];
  }

  const material = lineType && lineType.pattern && lineType.pattern.length !== 0
    ? new LineDashedMaterial({
        color: color,
        gapSize: 4,
        dashSize: 4
      })
    : new LineBasicMaterial({
        linewidth: 1,
        color: color
      })


  const line = new ThreeLine(geometry, material);

  return line;
}

export default Line;