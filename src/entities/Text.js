import {
  Vector3
} from '@babylonjs/core';

const Text = (entity) => {
  const text = entity.props.text;
  const color = entity.getColor(true);
  const fontSize = 24 * entity.props.textHeight;
  const font = fontSize + "px Arial Narrow";

  //Set height for plane
  const planeHeight = 1 * entity.props.textHeight;
  
  //Set height for dynamic texture
  const textureHeight = .725 * fontSize; //or set as wished

  //Use a temporay canvas to calculate the length of the text on the dynamic texture canvas
  const tempCanvas = document.createElement("canvas");
  const context = tempCanvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  const textureWidth = metrics.width;

  //Calcultae ratio
  const ratio = planeHeight/textureHeight;

  //Calculate width the plane has to be 
  const planeWidth = textureWidth * ratio;

  const position = new Vector3(entity.props.startPoint.x, entity.props.startPoint.y, entity.props.startPoint.z);
  const rotation = entity.props.rotation && {z: entity.props.rotation * Math.PI / 180};

  // //Create dynamic texture and write the text
  // const dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", {width: textureWidth, height: textureHeight}, false);
  // const mat = new BABYLON.StandardMaterial("mat");
  // mat.diffuseTexture = dynamicTexture;
  // mat.diffuseTexture.hasAlpha = true;
  // dynamicTexture.drawText(text, null, textureHeight, font, color, null, true);
  
  // //Create plane and set dynamic texture as material
  // const plane = BABYLON.MeshBuilder.CreatePlane(name, {width: planeWidth, height: planeHeight});
  // plane.bakeTransformIntoVertices(BABYLON.Matrix.Translation(planeWidth / 2, planeHeight / 2, 0));
  // plane.position = new Vector3(entity.props.startPoint.x, entity.props.startPoint.y, entity.props.startPoint.z)
  
  // if (entity.props.rotation) {
  //   plane.rotation.z = entity.props.rotation * Math.PI / 180;
  // }    
  
  // plane.material = mat;

  // plane.layerMask =  0x000002;

  return {
    type: 'Text',
    color,
    font,
    text,
    textureHeight,
    textureWidth,
    planeWidth,
    planeHeight,
    position,
    rotation
  };
}

export default Text;