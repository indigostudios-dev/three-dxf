import {
  TextGeometry,
  MeshBasicMaterial
} from 'three';

import {
  Mesh,
  Vector3,
  VertexData
} from 'babylonjs';

const Text = (entity) => {
  if (!entity.font)
    return console.warn('Text is not supported without a Three.js font loaded with THREE.FontLoader! Load a font of your choice and pass this into the constructor. See the sample for this repository or Three.js examples at http://threejs.org/examples/?q=text#webgl_geometry_text for more details.');

  console.log(entity.props)

  // var font_size = 48;
	// var font = "bold " + font_size + "px Arial";
	
	// // Set height for plane
  // var planeHeight = 5;
  
  // // Set height for dynamic texture
  // var DTHeight = 1.5 * font_size; // or set as wished
  
  // // Calcultae ratio
  // var ratio = planeHeight/DTHeight;
	
	// // Set text
  // var text = entity.props.text;
    
  // var temp = new BABYLON.DynamicTexture("DynamicTexture", 64);
	// var tmpctx = temp.getContext();
	// tmpctx.font = font;
  // var DTWidth = tmpctx.measureText(text).width;
    
  // let DTWidth, DTHeight;
  // if (entity.props.endPoint) {
  //   const dist = Vector3.Distance(
  //     new Vector3(entity.props.startPoint.x, entity.props.startPoint.y, entity.props.startPoint.z),
  //     new Vector3(entity.props.endPoint.x, entity.props.endPoint.y, entity.props.endPoint.z)
  //   )
  //   console.log(dist);
  //   DTWidth = dist;
  // }

      //Set font type
      var font_type = "Arial";
	
      //Set width an height for plane
      var planeWidth = 0;
      var planeHeight = entity.props.textHeight;
  
      if (entity.props.endPoint) {
        const start = new Vector3(entity.props.startPoint.x, entity.props.startPoint.y, entity.props.startPoint.z);
        const mid = new Vector3(entity.props.endPoint.x + (entity.props.textHeight / 2), entity.props.endPoint.y, entity.props.endPoint.z);
        const end = new Vector3(2 * mid.x - start.x, 2 * mid.y - start.y, 0)

        const dist = Vector3.Distance(start, end);
        console.log(end)
        planeWidth = dist;
      }

      //Create plane
      var plane = BABYLON.MeshBuilder.CreatePlane("plane", {width:planeWidth, height:planeHeight});
      plane.bakeTransformIntoVertices(BABYLON.Matrix.Translation(planeWidth/2, planeHeight / 2, 0));
      plane.position = new Vector3(entity.props.startPoint.x, entity.props.startPoint.y, entity.props.startPoint.z)

      if (entity.props.rotation) {
        const zRotation = entity.props.rotation * Math.PI / 180;
    
        plane.rotation.z = zRotation;
      }

      //Set width and height for dynamic texture using same multiplier
      var DTWidth = planeWidth * 60;
      var DTHeight = planeHeight * 60;
  
      //Set text
      var text = entity.props.text;
      
      //Create dynamic texture
      var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", {width:DTWidth, height:DTHeight});
  
      //Check width of text for given font type at any size of font
      var ctx = dynamicTexture.getContext();
      var size = entity.props.textHeight || 12; //any value will work
      ctx.font = size + "px " + font_type;
      var textWidth = ctx.measureText(text).width;
      
      //Calculate ratio of text width to size of font used
      var ratio = textWidth/size;
    
    //set font to be actually used to write text on dynamic texture
      var font_size = Math.floor(DTWidth / (ratio * 1)); //size of multiplier (1) can be adjusted, increase for smaller text
      var font = font_size + "px " + font_type;
    
    //Draw text
      dynamicTexture.drawText(text, null, null, font, "#000000", "#ffffff", true);
  
      //create material
      var mat = new BABYLON.StandardMaterial("mat");
      mat.diffuseTexture = dynamicTexture;
      mat.diffuseTexture.hasAlpha = true;
            
      //apply material
      plane.material = mat;
      

  // Calculate width the plane has to be 
  // var planeWidth = DTWidth * ratio;

  // console.log(planeWidth)

  // // Create dynamic texture and write the text
  // var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", {width: DTWidth, height: DTHeight}, null, false);
  // var mat = new BABYLON.StandardMaterial("mat");
  // mat.diffuseTexture = dynamicTexture;
  // mat.diffuseTexture.hasAlpha = true;
  // dynamicTexture.drawText(text, null, null, font, "#000000", "#ffffff", true);

  // Create plane and set dynamic texture as material
  // var plane = BABYLON.MeshBuilder.CreatePlane("plane", {width:planeWidth, height:planeHeight});
  // plane.material = mat;
  // plane.bakeTransformIntoVertices(BABYLON.Matrix.Translation(planeWidth/2, planeHeight / 2, 0));
  // plane.position = new Vector3(entity.props.startPoint.x, entity.props.startPoint.y, entity.props.startPoint.z)

  // const geometry = new TextGeometry(entity.props.text, {
  //   font: entity.font,
  //   height: 0,
  //   size: entity.props.textHeight || 12
  // });

  // const text = new Mesh("custom");
  // const vertexData = new VertexData();

  // const material = new MeshBasicMaterial({
  //   color: entity.getColor()
  // });

  
  // const text = new Mesh(geometry, material);
  // text.position.x = entity.props.startPoint.x;
  // text.position.y = entity.props.startPoint.y;
  // text.position.z = entity.props.startPoint.z;

  // return text;
}

export default Text;