import {
  Object3D
} from 'three';

import {
  TransformNode
} from '@babylonjs/core/Legacy/legacy';

import Entity from '../Entity';

const Block = (entity) => {
  const block = entity.source.blocks[entity.props.name];

  if (!block.entities) return null;

  const group = new TransformNode();

  if (entity.props.xScale) group.scale.x = entity.props.xScale;
  if (entity.props.yScale) group.scale.y = entity.props.yScale;

  if (entity.props.rotation) {
    group.rotation.z = entity.props.rotation * Math.PI / 180;
  }

  if (entity.props.position) {
    group.position.x = entity.props.position.x;
    group.position.y = entity.props.position.y;
    group.position.z = entity.props.position.z;
  }

  const registrationMark = new TransformNode('Registraton Mark');
  registrationMark.parent = group;
  registrationMark.setEnabled(false);
  
  for (let i = 0; i < block.entities.length; i++) {
    const {type, ...props} = block.entities[i];

    const {mesh} = new Entity(type, props, entity.source);

    if (mesh) mesh.parent = registrationMark;
  }

  return group;
}

export default Block;