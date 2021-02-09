import { PointerEventTypes, Vector3 } from 'babylonjs';

function Controls(scene) {
  this.scene = scene;
  this.engine = scene.getEngine();

   // name, alpha, beta, radius, target, scene
  const camera = this.camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 10, BABYLON.Vector3.Zero());
  camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
  camera.inertia = 0;
  camera.panningInertia = 0;
  camera.attachControl(false, true, 1);

  const inputManager = camera.inputs;
  inputManager.remove(inputManager.attached.mousewheel);

  this.oldX = 0; //old mouse pointer x value
  this.oldY = 0; //old mouse pointer y value
  this.panning = false;

  this.setZoom(1, 5);

  scene.onPointerObservable.add((pointerInfo) => {
		switch (pointerInfo.type) {
			case BABYLON.PointerEventTypes.POINTERDOWN:
				// console.log("scene pointer event. pointerInfo obj:", pointerInfo);
				console.log(pointerInfo.pickInfo.pickedMesh);
				break;
        }
  });

  scene.onPointerObservable.add(({ event }) => {
    event.preventDefault();
    let delta = (Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail || event.deltaY)))) * this.zoomSteps;

    const min = 0, max = 300;

    if (this.zoomLevel - delta > min && this.zoomLevel - delta < max) {
        this.zoomLevel -= delta;
        this._zoomToPoint(delta);
    }
  }, PointerEventTypes.POINTERWHEEL);

  scene.onPointerObservable.add(this._panToPoint.bind(this))

  // Lock rotation
  const rot_state = {x:camera.alpha , y:camera.beta};
  scene.registerBeforeRender(() => {
    camera.alpha = rot_state.x;
    camera.beta = rot_state.y;
  })
}

Controls.prototype.setZoom = function (zoomLevel, zoomSteps) {
  const {width, height} = this.engine.getRenderingCanvasClientRect();
  const ratio = height / width;

  this.zoomLevel = zoomLevel;
  this.zoomSteps = zoomSteps;

  this.camera.orthoLeft = -zoomLevel;
  this.camera.orthoRight = zoomLevel;
  this.camera.orthoTop = this.camera.orthoRight * ratio;
  this.camera.orthoBottom = this.camera.orthoLeft * ratio;
}

Controls.prototype._zoomToPoint = function (delta) {
  const zoomingOut = delta < 0;

  const totalX = Math.abs(this.camera.orthoLeft - this.camera.orthoRight);
  const totalY = Math.abs(this.camera.orthoTop - this.camera.orthoBottom);
  const aspectRatio = totalY / totalX;

  const zoomTarget = Vector3.Unproject(
    new Vector3(this.scene.pointerX || 0, this.scene.pointerY || 0, 0),
    this.engine.getRenderWidth(),
    this.engine.getRenderHeight(),
    this.camera.getWorldMatrix(),
    this.camera.getViewMatrix(),
    this.camera.getProjectionMatrix()
  );

  const fromCoord = {
    left: this.camera.orthoLeft - zoomTarget.x,
    right: this.camera.orthoRight - zoomTarget.x,
    top: this.camera.orthoTop - zoomTarget.y,
    bottom: this.camera.orthoBottom - zoomTarget.y
  }

  const ratio = {
    left: fromCoord.left / totalX,
    right: fromCoord.right / totalX,
    top: fromCoord.top / totalY,
    bottom: fromCoord.bottom / totalY
  }

  this.camera.orthoLeft -= ratio.left * delta;
  this.camera.orthoRight -= ratio.right * delta;
  this.camera.orthoTop -= ratio.top * delta * aspectRatio;
  this.camera.orthoBottom -= ratio.bottom * delta * aspectRatio;
}

Controls.prototype._panToPoint = function ({ type, event }) {
  switch (type) {
    case PointerEventTypes.POINTERDOWN:

      this.oldX = this.scene.pointerX;
      this.oldY = this.scene.pointerY;

      if (event.button == 1) {
        // //enable custom panning 
        this.panning = true;
        this.camera.detachControl();
      }

      break;

    case PointerEventTypes.POINTERUP:
      if (event.button == 1) {
        this.panning = false;
        this.camera.attachControl(true);
      }
      break;

    case PointerEventTypes.POINTERMOVE:

      if (this.panning) {
        const {width, height} = this.engine.getRenderingCanvasClientRect();
        const scaleWidth = (this.camera.orthoRight - this.camera.orthoLeft) / width;
        const scaleHeight = (this.camera.orthoBottom - this.camera.orthoTop) / height;
        const scale = Math.max(scaleWidth, scaleHeight);

        const diff = this.oldX > 0 || this.oldY > 0
          ? {
              x: this.scene.pointerX - this.oldX,
              y: this.scene.pointerY - this.oldY
            }
          : {
              x: 0,
              y: 0
            };

        if (this.scene.pointerX < this.oldX || this.scene.pointerX > this.oldX) {
          // pointer traversing left 
          this.camera.targetScreenOffset.x = this.camera.targetScreenOffset.x + (diff.x * scale);
        }
        if (this.scene.pointerY < this.oldY || this.scene.pointerY > this.oldY) {
          // pointer traversing up 
          this.camera.targetScreenOffset.y = this.camera.targetScreenOffset.y - (diff.y * scale);
        }

        this.oldX = this.scene.pointerX;
        this.oldY = this.scene.pointerY;

      }

      break;
  }
}

export default Controls;