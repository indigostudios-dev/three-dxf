import {
  Vector3
} from '@babylonjs/core/Legacy/legacy';

const Point = (entity) => {
  const point = new BABYLON.Mesh(entity.props.handle);

  point.position = new Vector3(entity.props.position.x, entity.props.position.y, entity.props.position.z);

  return point;
}

export default Point;