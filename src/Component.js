import Entity from './Entity';

import {
  Color3,
  TransformNode
} from 'babylonjs';

import layers from './mocks/layers';

function Block(source) {
  this.layers = {};
  this.geometry = this.build(source);
 this.showLayers();
  return this;
};

Block.prototype.highlight = function () {
  console.log(this.layers)

  // const layer = this.layers['FL_GO'];

  // layer.showBoundingBox = true;

	// var hl = new BABYLON.HighlightLayer("hl1", null, {
  //   // blurVerticalSize: 1,
  //   // blurHorizontalSize: 1,
  //   // mainTextureRatio: .01,
  //   mainTextureFixedSize: 64
  // });
    
  // layer.getChildMeshes().forEach(mesh => {
  //   console.log(mesh)
  //   hl.addMesh(mesh, BABYLON.Color3.Red());
  // })


}

Block.prototype.showLayers = function () {
  for (let name in this.layers) {
    const layer = layers.find(el => el.LayerName === name)
    
    if (layer) this.layers[name].setEnabled(layer.Visibility === 'Visible' ? true : false);
  }
}

Block.prototype.build = function (source) {
  const root = new TransformNode('root')

  for (let i = 0; i < source.entities.length; i++) {
    const { type, ...props } = source.entities[i];

    const entity = new Entity(type, props, source, this.layers[props.layer]);

    if (!entity.mesh) continue;

    if (!this.layers[props.layer]) {
      this.layers[props.layer] = new TransformNode(props.layer);
      this.layers[props.layer].parent = root;
    }

    entity.mesh.parent = this.layers[props.layer]

    
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