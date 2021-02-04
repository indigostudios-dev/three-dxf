import Entity from '../Entity';

const Dimension = (entity) => {
  const block = entity.source.blocks[entity.props.block];

  if (!block || !block.entities) return null;

  const group = new THREE.Object3D();
  // if(entity.props.anchorPoint) {
  //     group.position.x = entity.props.anchorPoint.x;
  //     group.position.y = entity.props.anchorPoint.y;
  //     group.position.z = entity.props.anchorPoint.z;
  // }

  for (let i = 0; i < block.entities.length; i++) {
    const {type, ...props} = block.entities[i];

    const { entity } = new Entity(type, props);

    if (entity) group.add(entity);
  }

  return group;
}

export default Dimension;