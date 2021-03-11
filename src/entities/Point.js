import {
  Vector3
} from '@babylonjs/core';

const Point = (entity) => {
  const position = new Vector3(entity.props.position.x, entity.props.position.y, entity.props.position.z);

  return {
    type: 'Mesh',
    index: entity.index,
    position
  };
}

export default Point;