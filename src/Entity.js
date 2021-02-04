import * as Entities from './entities';

function Entity(type, props) {
  this.type = type;
  this.props = props;

  this.entity = this.draw();

  return this;
};

Entity.prototype.source = null;

Entity.prototype.font = null;

Entity.prototype.scene = null;

Entity.prototype.getColor = function () {
  let color = 0x000000; //default
  
  if (this.props.color) {
    color = this.props.color;
  } else if (this.source.tables && this.source.tables.layer && this.source.tables.layer.layers[this.props.layer]) {
    color = this.source.tables.layer.layers[this.props.layer].color;
  }

  if (color == null || color === 0xffffff) {
    color = 0x000000;
  }
  return color;
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
    case 'SOLID':
      return Entities.Solid(this);
    case 'POINT':
      return Entities.Point(this);
    case 'INSERT':
      return Entities.Block(this);
    case 'SPLINE':
      return Entities.Spline(this);
    case 'MTEXT':
      return Entities.Mtext(this);
    case 'ELLIPSE':
      return Entities.Ellipse(this);
    case 'DIMENSION':
      const dimTypeEnum = this.props.dimensionType & 7;

      if (dimTypeEnum === 0) {
        return Entities.Dimension(this);
      } else {
        console.log("Unsupported Dimension type: " + dimTypeEnum);
      }
      break;
    default:
      console.log("Unsupported Entity Type: " + JSON.stringify(this.type));
    }

  return null;
}

export default Entity;