import Entity from './Entity';

import {
  Color3,
  AbstractMesh
} from 'babylonjs';

import layers from './mocks/layers';

const componentGroupName = 'COMPONENT2D';

const ignore = [
  'SAFETY_EN',
  'SAFETY_CPSC',
]

function Component(source) {
  this.layers = {};
  this.geometry = this.build(source);
  this.isSelected = false;

  return this;
};

Component.prototype.select = function () {
  if (this.isSelected) return;

  this._highlight();
  this.isSelected = true;

  return this;
}

Component.prototype.deselect = function () {
  if (!this.isSelected) return;

  this.highlight.dispose();
  this.isSelected = false;

  return null;
}

Component.prototype.getBoundingBox = function () {
  const bb = this.layers[componentGroupName].getHierarchyBoundingVectors(true/*, mesh => mesh.isPickable*/);

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

Component.prototype.groupComponents = function () {
  this.layers[componentGroupName] = new AbstractMesh(componentGroupName);

  for (let name in this.layers) {
    const layer = layers.find(el => el.LayerName === name);

    if (!layer) {
      this.layers[name].parent = this.layers[componentGroupName];

      delete this.layers[name];
    }
  }
}

Component.prototype.build = function (source) {
  const root = new AbstractMesh('root');

  for (let i = 0; i < source.entities.length; i++) {
    const { type, ...props } = source.entities[i];

    // Some Layers are in the components but not in the database
    // Exclude the ones that are left over from rules that arent implemented
    if (ignore.includes(props.layer)) continue;

    const entity = new Entity(type, props, source, this.layers[props.layer]);
    
    if (!entity.mesh) continue;

    if (!this.layers[props.layer]) {
      this.layers[props.layer] = new AbstractMesh(props.layer);
      this.layers[props.layer].parent = root;
    }

    entity.mesh.parent = this.layers[props.layer]
  }

  this.groupComponents();
  this.showLayers();
  // this._highlight();

  this._definePickRegion()


  return root;
}

Component.prototype._definePickRegion = function () {
  const boundingInfo = this.getBoundingBox();
  const pickRegion = BABYLON.MeshBuilder.CreatePlane("PickRegion", {width: boundingInfo.width, height: boundingInfo.height});
  pickRegion.isVisible = false;
  pickRegion.position = boundingInfo.center;
  pickRegion.instance = this;
}

Component.prototype._highlight = function () {
  const boundingInfo = this.getBoundingBox();

  this.highlight = BABYLON.MeshBuilder.CreatePlane("Highlight", {width: boundingInfo.width, height: boundingInfo.height});
  this.highlight.material = new BABYLON.StandardMaterial("sm");
  this.highlight.material.diffuseColor = BABYLON.Color3.Red();
  this.highlight.material.alpha = 0.2;
  this.highlight.position = boundingInfo.center;
}

export default Component;