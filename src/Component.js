import Entity from './Entity';

import {
  Color3,
  AbstractMesh,
  TransformNode
} from 'babylonjs';

import layers from './mocks/layers';

const componentGroupName = 'COMPONENT2D';

const notPickable = [
  'SAFETY_EN',
  'SAFETY_CPSC',
]

function Component(source) {
  this.layers = {};
  this.componentLayers = {};
  this.isSelected = false;
  
  this.mesh = this.build(source);

  console.log(this.componentLayers)

  return this;
};

Component.prototype.select = function () {
  if (this.isSelected) return;

  this.highlight.isVisible = true;
  this.isSelected = true;

  return this;
}

Component.prototype.deselect = function () {
  if (!this.isSelected) return;

  this.highlight.isVisible = false;
  this.isSelected = false;

  return null;
}

Component.prototype.getBoundingBox = function (layer) {
  const bb = this.layers[layer].getHierarchyBoundingVectors(true, mesh => mesh.isPickable);

  var width = bb.max.x - bb.min.x;
  var height = bb.max.y - bb.min.y;
  var center = bb.max.add(bb.min).scale(0.5);

  return {width, height, center};
}

Component.prototype.showLayers = function () {
  for (let name in this.layers) {
    const layer = layers.find(el => el.LayerName === name)
    
    if (layer) this.layers[name].setEnabled(layer.Visibility === 'Visible' ? true : false);
  }
}

Component.prototype._groupComponents = function (parent) {
  this.layers[componentGroupName] = new TransformNode(componentGroupName);
  this.layers[componentGroupName].parent = parent;
  this.layers[componentGroupName].instance = this;

  for (let name in this.layers) {
    const layer = layers.find(el => el.LayerName === name);

    if (!layer) {
      this.layers[name].parent = this.layers[componentGroupName];
      this.componentLayers[name] = this.layers[componentGroupName];

      delete this.layers[name];
    }
  }
}

Component.prototype.build = function (source) {
  const root = new TransformNode('root');

  for (let i = 0; i < source.entities.length; i++) {
    const { type, ...props } = source.entities[i];

    const entity = new Entity(type, props, source);
    
    if (!entity.mesh) continue;

    if (notPickable.includes(props.layer)) entity.mesh.isPickable = false;

    if (!this.layers[props.layer]) {
      this.layers[props.layer] = new TransformNode(props.layer);
      this.layers[props.layer].parent = root;
    }

    entity.mesh.parent = this.layers[props.layer]
  }

  this._groupComponents(root);
  // this.showLayers();
  this._createPickRegion(root);
  this._createHighlight(root);

  return root;
}

Component.prototype._createPickRegion = function (parent) {
  const boundingInfo = this.getBoundingBox(componentGroupName);
  const pickRegion = BABYLON.MeshBuilder.CreatePlane("PickRegion", {width: boundingInfo.width, height: boundingInfo.height});
  pickRegion.isVisible = false;
  pickRegion.position = boundingInfo.center;
  pickRegion.instance = this;
  pickRegion.parent = parent;
}

Component.prototype._createHighlight = function (parent) {
  const boundingInfo = this.getBoundingBox(componentGroupName);

  this.highlight = BABYLON.MeshBuilder.CreatePlane("Highlight", {width: boundingInfo.width, height: boundingInfo.height});
  this.highlight.material = new BABYLON.StandardMaterial("sm");
  this.highlight.material.diffuseColor = BABYLON.Color3.Red();
  this.highlight.material.alpha = 0.2;
  this.highlight.position = boundingInfo.center;
  this.highlight.isVisible = false;
  this.highlight.parent = parent;
}

export default Component;