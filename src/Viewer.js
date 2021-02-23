import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import * as GUI from '@babylonjs/gui';

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
function Viewer(data, canvas) {
  const engine = this.engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
  const scene = this.scene = new BABYLON.Scene(engine);
  scene.debugLayer.show();

  scene.clearColor = new BABYLON.Color3(1, 1, 1);
  
  const controls = this.controls = new Controls(scene, engine);

  // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0));
  light.intensity = 1;
  light.specular = new BABYLON.Color3(0,0,0);
  light.groundColor = new BABYLON.Color3(1,1,1);

  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  const textblock = new GUI.TextBlock();
  advancedTexture.addControl(textblock);
  textblock.text = "";
  textblock.fontSize = 24;
  textblock.color = "black";
  textblock.height = '40px';
  textblock.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  textblock.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

  for (let i = 0; i < data.entities.length; i++) {
    const { type, ...props } = data.entities[i];

    const entity = new Entity(type, props, data);
  }

  this.scene.executeWhenReady(() => {
    scene.onPointerObservable.add(({ event }) => {
      if (!textblock) return;
  
      const pos = BABYLON.Vector3.Unproject(
        new BABYLON.Vector3(scene.pointerX,scene.pointerY,1),
        engine.getRenderWidth(),
        engine.getRenderHeight(),
        BABYLON.Matrix.Identity(), scene.getViewMatrix(),
        scene.getProjectionMatrix()
      );
      
      textblock.text = `${pos.x}, ${pos.y}`;
    }, BABYLON.PointerEventTypes.MOUSEMOVE);
  });

  window.addEventListener("resize", this.resize.bind(this));

  engine.runRenderLoop(() => {
    scene.render();
    // this.render()
  })
}

Viewer.prototype.resize = function () {
  this.engine.resize();

  this.controls.updateView();
}

export default Viewer