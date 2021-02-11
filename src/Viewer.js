// import * as THREE from 'three';
import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

import Controls from './Controls';
import Component from './Component';

/**
 * Viewer class for a dxf object.
 * @param {Object} data - the dxf object
 * @param {Object} canvas - the canvas element to which we attach the rendering to
 * @param {Number} viewerWidth - width of the rendering canvas in pixels
 * @param {Number} viewerHeight - height of the rendering canvas in pixels
 * @param {Object} font - a font loaded with THREE.FontLoader 
 * @constructor
 */
async function Viewer(data, canvas, viewerWidth, viewerHeight) {
  const engine = this.engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
  const scene = this.scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(1, 1, 1);
  
  const controls = new Controls(scene, engine);

  // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0));
  light.intensity = 1;
  light.groundColor = new BABYLON.Color3(1,1,1);

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

  const component = new Component(data);


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