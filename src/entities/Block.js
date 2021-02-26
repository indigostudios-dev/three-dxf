// import {
//   TransformNode
// } from '@babylonjs/core/Legacy/legacy';

const Block = (entity) => {
  const block = entity.source.blocks[entity.props.name];

  if (!block.entities) return null;

  // const group = new TransformNode();
  const group = {
    scale: {},
    rotation: {},
    position: {}
  };
 
  const xScale = entity.props.xScale ? entity.props.xScale : null;
  const yScale = entity.props.yScale ? entity.props.yScale : null;
  const rotation = entity.props.rotation ? entity.props.rotation * Math.PI / 180 : null;
  const position = entity.props.position ? {x: entity.props.position.x, y: entity.props.position.y, z: entity.props.position.z} : null;


  // const registrationMark = new TransformNode('Registraton Mark');
  // registrationMark.isPickable = false;
  // registrationMark.parent = group;
  // registrationMark.setEnabled(false);
  
  // for (let i = 0; i < block.entities.length; i++) {
  //   const {type, ...props} = block.entities[i];

  //   const {mesh} = new Entity(type, props, entity.source);

  //   if (mesh) mesh.parent = registrationMark;
  // }

  return {
    type: 'TransformNode',
    xScale,
    yScale,
    rotation,
    position
  };
}

export default Block;