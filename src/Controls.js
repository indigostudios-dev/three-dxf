function Controls(scene) {
  this.zoomTarget = 5;

   // name, alpha, beta, radius, target, scene
  const camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, 0, 10, new BABYLON.Vector3(0,1,0), scene);
  camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;

  const inputManager = camera.inputs;
  inputManager.remove(inputManager.attached.mousewheel);

  this.setViewport(camera, scene);

  scene.onPointerObservable.add(() => {
    const engine = scene.getEngine();

    this.zoomTarget = BABYLON.Vector3.Unproject(
        new BABYLON.Vector3(scene.pointerX, scene.pointerY, 0),
        engine.getRenderWidth(),
        engine.getRenderHeight(),
        camera.getWorldMatrix(),
        camera.getViewMatrix(),
        camera.getProjectionMatrix()
    );
  }, BABYLON.PointerEventTypes.POINTERMOVE);

  scene.onPointerObservable.add(({ event }) => {
    event.preventDefault();

    const wheelDelta = (Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail || event.deltaY)))) * .5;

    setZoom(camera, wheelDelta);
  }, BABYLON.PointerEventTypes.POINTERWHEEL);
  
  // Lock rotation
  const rot_state = {x:camera.alpha , y:camera.beta};
  scene.registerBeforeRender(() => {
    camera.alpha = rot_state.x;
    camera.beta = rot_state.y;
  })

  // Camera Controls
  camera.attachControl(false, true, 0);
}

Controls.prototype.setViewport = function (camera, scene) {
  const {width, height} = scene.getEngine().getRenderingCanvasClientRect();
  const ratio = height / width;

  camera.orthoLeft = -this.zoomTarget;
  camera.orthoRight = this.zoomTarget;
  camera.orthoTop = camera.orthoRight * ratio;
  camera.orthoBottom = camera.orthoLeft * ratio;
}

const setZoom = (camera, delta) => {
  if (this.zoomTarget) {
    const totalX = Math.abs(camera.orthoLeft - camera.orthoRight);
    const totalY = Math.abs(camera.orthoTop - camera.orthoBottom);

    const aspectRatio = totalY / totalX;

    {
        const fromCoord = camera.orthoLeft - this.zoomTarget.x;
        const ratio = fromCoord / totalX;
        camera.orthoLeft -= ratio * delta;
    }
    
    {
        const fromCoord = camera.orthoRight - this.zoomTarget.x;
        const ratio = fromCoord / totalX;
        camera.orthoRight -= ratio * delta;
    }

    {
        const fromCoord = camera.orthoTop - this.zoomTarget.y;
        const ratio = fromCoord / totalY;
        camera.orthoTop -= ratio * delta * aspectRatio;
    }

    {
        const fromCoord = camera.orthoBottom - this.zoomTarget.y;
        const ratio = fromCoord / totalY;
        camera.orthoBottom -= ratio * delta * aspectRatio;
    }
  }
}

export default Controls;