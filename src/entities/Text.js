import {
  Mesh,
  Vector3,
  VertexData
} from 'babylonjs';

const Text = (entity) => {
  if (!entity.font)
    return console.warn('Text is not supported without a Three.js font loaded with THREE.FontLoader! Load a font of your choice and pass this into the constructor. See the sample for this repository or Three.js examples at http://threejs.org/examples/?q=text#webgl_geometry_text for more details.');

  const font_size = 24 * entity.props.textHeight;
  const font = font_size + "px Arial Narrow";
  
  //Set height for plane
  const planeHeight = 1 * entity.props.textHeight;
  
  //Set height for dynamic texture
  const DTHeight = .725 *font_size; //or set as wished
    
  //Set text
  const text = entity.props.text;

  //Use a temporay dynamic texture to calculate the length of the text on the dynamic texture canvas
  const temp = new BABYLON.DynamicTexture("DynamicTexture", 32);
  const ctx = temp.getContext();
  ctx.font = font;
  const DTWidth = ctx.measureText(text).width;
  
  //Calcultae ratio
  const ratio = planeHeight/DTHeight;

  //Calculate width the plane has to be 
  const planeWidth = DTWidth * ratio;

  //Create dynamic texture and write the text
  const dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", {width: DTWidth, height: DTHeight}, false);
  const mat = new BABYLON.StandardMaterial("mat");
  mat.diffuseTexture = dynamicTexture;
  mat.diffuseTexture.hasAlpha = true;
  dynamicTexture.drawText(text, null, DTHeight, font, entity.getColor(true), null, true);
  
  //Create plane and set dynamic texture as material
  const plane = BABYLON.MeshBuilder.CreatePlane("plane", {width: planeWidth, height: planeHeight});
  plane.bakeTransformIntoVertices(BABYLON.Matrix.Translation(planeWidth / 2, planeHeight / 2, 0));
  plane.position = new Vector3(entity.props.startPoint.x, entity.props.startPoint.y, entity.props.startPoint.z)
  
  if (entity.props.rotation) {
    const zRotation = entity.props.rotation * Math.PI / 180;

    plane.rotation.z = zRotation;
  }    
  
  plane.material = mat;
}

export default Text;