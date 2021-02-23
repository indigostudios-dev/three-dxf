import {
  Vector3
} from '@babylonjs/core/Legacy/legacy';

const Point = (entity) => {
  const position = new Vector3(entity.props.position.x, entity.props.position.y, entity.props.position.z);

  return {
    type: 'Mesh',
    position
  };
}

export default Point;