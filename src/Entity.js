import * as Entities from './entities';

import { Color3 } from 'babylonjs';

/**
 * Entity class to draw a specific entity
 * @param {string} type The type of entity to be drawn
 * @param {object} props The entity object
 * @constructor
 */
function Entity(type, props) {
  this.type = type;
  this.props = props;

  // if (type !== 'TEXT') return;

  this.entity = this.draw();

  return this;
};

Entity.prototype.source = null;

Entity.prototype.font = null;

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
    return "#" + color.toString(16);
  } else {
    return Color3.FromHexString("#" + color.toString(16));
  }
}

Entity.prototype.draw = function () {
  switch (this.type) {
    case 'CIRCLE':
    case 'ARC':
      return Entities.Arc(this);
    case 'POLYLINE':
    case 'LWPOLYLINE':
    case 'LINE':
      return Entities.Line(this);
    case 'TEXT':
      return Entities.Text(this);
    // case 'SOLID':
    //   return Entities.Solid(this);
    // case 'POINT':
    //   return Entities.Point(this);
    // case 'INSERT':
    //   return Entities.Block(this);
    // case 'SPLINE':
    //   return Entities.Spline(this);
    // case 'MTEXT':
    //   return Entities.Mtext(this);
    // case 'ELLIPSE':
    //   return Entities.Ellipse(this);
    // case 'DIMENSION':
    //   const dimTypeEnum = this.props.dimensionType & 7;

    //   if (dimTypeEnum === 0) {
    //     return Entities.Dimension(this);
    //   } else {
    //     console.log("Unsupported Dimension type: " + dimTypeEnum);
    //   }
    //   break;
    default:
      console.log("Unsupported Entity Type: " + JSON.stringify(this.type));
    }

  return null;
}

export default Entity;