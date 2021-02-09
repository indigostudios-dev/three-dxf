// import * as THREE from 'three';
import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

import Controls from './Controls';
import Entity from './Entity';

/**
 * Viewer class for a dxf object.
 * @param {Object} data - the dxf object
 * @param {Object} canvas - the canvas element to which we attach the rendering to
 * @param {Number} viewerWidth - width of the rendering canvas in pixels
 * @param {Number} viewerHeight - height of the rendering canvas in pixels
 * @param {Object} font - a font loaded with THREE.FontLoader 
 * @constructor
 */
async function Viewer(data, canvas, viewerWidth, viewerHeight, font) {
  const engine = this.engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
  const scene = this.scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(1, 1, 1);
  
  const controls = new Controls(scene, engine);

  // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
  // // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
  // const sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene, false, BABYLON.Mesh.FRONTSIDE);
  // // Move the sphere upward 1/2 of its height
  // sphere.position.y = 1;
  // // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
  // const ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene, false);
  // // Return the created scene
 
  // Provide entity class access to common objects
  Entity.prototype.source = data;
  Entity.prototype.font = font;

  // Create scene from dxf object (data)
  const dims = {
    min: {
      x: false,
      y: false,
      z: false
    },
    max: {
      x: false,
      y: false,
      z: false
    }
  };

  var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  var textblock = new GUI.TextBlock();
  textblock.text = "";
  textblock.fontSize = 24;
  textblock.color = "black";
  textblock.height = '40px';
  advancedTexture.addControl(textblock);
  textblock.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  textblock.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

  for (let i = 0; i < data.entities.length; i++) {
    const { type, ...props } = data.entities[i];

    const {entity} = new Entity(type, props);

    // if (entity) {
    //   const {min, max} = new THREE.Box3().setFromObject(entity);

    //   if (min.x && ((dims.min.x === false) || (dims.min.x > min.x))) dims.min.x = min.x;
    //   if (min.y && ((dims.min.y === false) || (dims.min.y > min.y))) dims.min.y = min.y;
    //   if (min.z && ((dims.min.z === false) || (dims.min.z > min.z))) dims.min.z = min.z;
    //   if (max.x && ((dims.max.x === false) || (dims.max.x < max.x))) dims.max.x = max.x;
    //   if (max.y && ((dims.max.y === false) || (dims.max.y < max.y))) dims.max.y = max.y;
    //   if (max.z && ((dims.max.z === false) || (dims.max.z < max.z))) dims.max.z = max.z;
      
    //   scene.add(entity);
    // }
  }

  // const width = viewerWidth || parent.clientWidth;
  // const height = viewerHeight || parent.clientHeight;
  // const aspectRatio = width / height;

  // const upperRightCorner = {
  //   x: dims.max.x,
  //   y: dims.max.y
  // };
  // const lowerLeftCorner = {
  //   x: dims.min.x,
  //   y: dims.min.y
  // };

  // // Figure out the current viewport extents
  // let vp_width = upperRightCorner.x - lowerLeftCorner.x;
  // let vp_height = upperRightCorner.y - lowerLeftCorner.y;
  // const center = center || {
  //   x: vp_width / 2 + lowerLeftCorner.x,
  //   y: vp_height / 2 + lowerLeftCorner.y
  // };

  // // Fit all objects into current ThreeDXF viewer
  // const extentsAspectRatio = Math.abs(vp_width / vp_height);
  // if (aspectRatio > extentsAspectRatio) {
  //   vp_width = vp_height * aspectRatio;
  // } else {
  //   vp_height = vp_width / aspectRatio;
  // }

  // const viewPort = {
  //   bottom: -vp_height / 2,
  //   left: -vp_width / 2,
  //   top: vp_height / 2,
  //   right: vp_width / 2,
  //   center: {
  //     x: center.x,
  //     y: center.y
  //   }
  // };

  // const camera = this.camera = new THREE.OrthographicCamera(viewPort.left, viewPort.right, viewPort.top, viewPort.bottom, 1, 19);
  // camera.position.z = 10;
  // camera.position.x = viewPort.center.x;
  // camera.position.y = viewPort.center.y;

  // controls.addEventListener('change', this.render.bind(this));
  // this.render();
  this.scene.executeWhenReady(() => {
    scene.onPointerObservable.add(({ event }) => {
      if (!textblock) return;
  
      const pos = BABYLON.Vector3.Unproject(
        new BABYLON.Vector3(scene.pointerX,scene.pointerY,1),
        engine.getRenderWidth(),
        engine.getRenderHeight(),
        BABYLON.Matrix.Identity(), scene.getViewMatrix(),
        scene.getProjectionMatrix());
      textblock.text = `${pos.x}, ${pos.y}`;
    }, BABYLON.PointerEventTypes.MOUSEMOVE);
  });

  engine.runRenderLoop(() => {
    scene.render();
    // this.render()
  })
}

Viewer.prototype.render = function(force) {
  const inertialRadiusOffset = this.scene.activeCamera.inertialRadiusOffset
  const inertialAlphaOffset = this.scene.activeCamera.inertialAlphaOffset
  const inertialBetaOffset = this.scene.activeCamera.inertialBetaOffset

  if (force || Math.abs(inertialRadiusOffset) > 0 || Math.abs(inertialAlphaOffset) > 0 || Math.abs(inertialBetaOffset) > 0) {
    console.log('render')
    this.scene.render();
  }
}

Viewer.prototype.resize = function(width, height) {
  this.engine.resize();
};

export default Viewer