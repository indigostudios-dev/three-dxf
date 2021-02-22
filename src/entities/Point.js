import {
  Vector3
} from 'babylonjs';

const Point = (entity) => {
  const point = new BABYLON.Mesh(entity.props.handle);

  const mat = new BABYLON.StandardMaterial("mat");
  mat.diffuseColor = entity.getColor();

  point.position = new Vector3(entity.props.position.x, entity.props.position.y, entity.props.position.z);

  return point;
}

export default Point;