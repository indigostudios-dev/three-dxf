import {
  Mesh,
  Vector3,
  VertexData
} from '@babylonjs/core/Legacy/legacy';

const Text = (entity) => {
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
  temp.dispose();
  
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
  const plane = BABYLON.MeshBuilder.CreatePlane(entity.props.handle, {width: planeWidth, height: planeHeight});
  plane.bakeTransformIntoVertices(BABYLON.Matrix.Translation(planeWidth / 2, planeHeight / 2, 0));
  plane.position = new Vector3(entity.props.startPoint.x, entity.props.startPoint.y, entity.props.startPoint.z)
  
  if (entity.props.rotation) {
    plane.rotation.z = entity.props.rotation * Math.PI / 180;
  }    
  
  plane.material = mat;

  plane.layerMask =  0x000002;

  return plane;
}

export default Text;