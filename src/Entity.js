import * as Entities from './entities';

import { Color3 } from '@babylonjs/core';

/**
 * Entity class to draw a specific entity
 * @param {string} type The type of entity to be drawn
 * @param {object} props The entity object
 * @constructor
 */
function Entity(type, props, source) {
  this.type = type;
  this.props = props;
  this.source = source;

  // if (type !== 'INSERT') return;
  const mesh = this.draw();
  mesh.name = this.props.handle;
  mesh.layer = this.props.layer;
console.log(source)
  this.source = null;
  this.props = null;
  this.type = null;

  return mesh;
};

Entity.prototype.getColor = function (getHexCode) {
  let color = 0x000000; //default

  if (this.props.color) {
    color = this.props.color;
  } else if (this.source.tables && this.source.tables.layer && this.source.tables.layer.layers[this.props.layer]) {
    color = this.source.tables.layer.layers[this.props.layer].color;
  }

  if (color == null || color === 0xffffff) {
    color = 0x000000;
  }

  if (getHexCode) {
    return "#" + color.toString(16).padStart(6, '0');
  } else {
    return Color3.FromHexString("#" + color.toString(16).padStart(6, '0'));
  }
}

Entity.prototype.draw = function () {
  const drawEntityFunction = Entities[this.type];

  if (drawEntityFunction) {
    return drawEntityFunction(this);
  } else {
    console.log("Unsupported Entity Type: " + JSON.stringify(this.type));
   
    return null;
  }
}

export default Entity;