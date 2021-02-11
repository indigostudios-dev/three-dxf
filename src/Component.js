import Entity from './Entity';

import {
  TransformNode
} from 'babylonjs';

function Block(source) {
  this.geometry = this.build(source);
console.log(this.geometry.getChildren())
  // this.geometry.getChildren()[2].setEnabled(false)
  return this;
};

Block.prototype.build = function (source) {
  const root = new TransformNode('root')

  const layers = {};

  for (let i = 0; i < source.entities.length; i++) {
    const { type, ...props } = source.entities[i];

    const entity = new Entity(type, props, source);

    if (!entity.mesh) continue;

    if (!layers[entity.props.layer]) {
      layers[entity.props.layer] = new TransformNode(entity.props.layer);
      layers[entity.props.layer].parent = root;
    }
    
    entity.mesh.parent = layers[entity.props.layer]

    // if (entity) {
    //   const {min, max} = new THREE.Box3().setFromObject(entity);

    //   if (min.x && ((dims.min.x === false) || (dims.min.x > min.x))) dims.min.x = min.x;
    //   if (min.y && ((dims.min.y === false) || (dims.min.y > min.y))) dims.min.y = min.y;
    //   if (min.z && ((dims.min.z === false) || (dims.min.z > min.z))) dims.min.z = min.z;
    //   if (max.x && ((dims.max.x === false) || (dims.max.x < max.x))) dims.max.x = max.x;
    //   if (max.y && ((dims.max.y === false) || (dims.max.y < max.y))) dims.max.y = max.y;
    //   if (max.z && ((dims.max.z === false) || (dims.max.z < max.z))) dims.max.z = max.z;
      
    //   scene.add(entity);
    // }
  }

  return root;
}


export default Block;