import {
  TextGeometry,
  Mesh,
  MeshBasicMaterial
} from 'three';

const Text = (entity) => {
  if (!entity.font)
    return console.warn('Text is not supported without a Three.js font loaded with THREE.FontLoader! Load a font of your choice and pass this into the constructor. See the sample for this repository or Three.js examples at http://threejs.org/examples/?q=text#webgl_geometry_text for more details.');

  const geometry = new TextGeometry(entity.props.text, {
    font: entity.font,
    height: 0,
    size: entity.props.textHeight || 12
  });

  if (entity.props.rotation) {
    const zRotation = entity.props.rotation * Math.PI / 180;
    geometry.rotateZ(zRotation);
  }

  const material = new MeshBasicMaterial({
    color: entity.getColor()
  });

  const text = new Mesh(geometry, material);
  text.position.x = entity.props.startPoint.x;
  text.position.y = entity.props.startPoint.y;
  text.position.z = entity.props.startPoint.z;

  return text;
}

export default Text;