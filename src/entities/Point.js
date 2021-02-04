import {
  Geometry,
  Vector3,
  PointsMaterial,
  VertexColors,
  Points
} from 'three';

const Point = (entity) => {
  const scene = entity.scene;

  const geometry = new Geometry();

  geometry.vertices.push(new Vector3(entity.props.position.x, entity.props.position.y, entity.props.position.z));

  // TODO: could be more efficient. PointCloud per layer?

  const numPoints = 1;

  const color = entity.getColor();
  const colors = new Float32Array(numPoints * 3);
  colors[0] = color.r;
  colors[1] = color.g;
  colors[2] = color.b;

  geometry.colors = colors;
  geometry.computeBoundingBox();

  const material = new PointsMaterial({
    size: 0.05,
    vertexColors: VertexColors
  });

  const point = new Points(geometry, material);
  // scene.add(point);
  return point;
}

export default Point;