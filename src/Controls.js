import * as BABYLON from 'babylonjs';

function Controls(scene) {
  this.scene = scene;
  this.engine = scene.getEngine();

   // name, alpha, beta, radius, target, scene
  const camera = this.camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 10, BABYLON.Vector3.Zero());
  camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
  camera.inertia = 0;
  camera.panningInertia = 0;
  camera.attachControl(false, true);

  const inputManager = camera.inputs;
  inputManager.remove(inputManager.attached.mousewheel);

  this.oldX = 0; //old mouse pointer x value
  this.oldY = 0; //old mouse pointer y value
  this.panning = false;

  this.setZoom(400, 10);

  scene.getBoundingBoxRenderer().frontColor.set(1, 0, 0);
  scene.getBoundingBoxRenderer().backColor.set(0, 1, 0);

  scene.onPointerObservable.add(({ event }) => {
    event.preventDefault();
    const zoomDelta = (Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail || event.deltaY)))) * this.zoomSteps;

    const min = 100, max = 1500;

    const totalX = Math.abs(this.camera.orthoLeft - this.camera.orthoRight);
    const totalY = Math.abs(this.camera.orthoTop - this.camera.orthoBottom);

    if (totalX - zoomDelta < min ||
        totalX - zoomDelta > max) return;

    this._zoomToPoint(zoomDelta);
  }, BABYLON.PointerEventTypes.POINTERWHEEL);

  scene.onPointerObservable.add(this._panToPoint.bind(this))

  // Lock rotation
  const rot_state = {x:camera.alpha , y:camera.beta};

  scene.registerBeforeRender(() => {
    camera.alpha = rot_state.x;
    camera.beta = rot_state.y;
  })

  return this;
}

Controls.prototype.updateView = function () {
  this.setZoom()
}

Controls.prototype.setZoom = function (zoomLevel, zoomSteps) {
  const {width, height} = this.engine.getRenderingCanvasClientRect() || {};
  const ratio = height / width;

  this.zoomSteps = zoomSteps || this.zoomSteps;
  this.zoomLevel = zoomLevel || this.zoomLevel;

  this.camera.orthoLeft = -this.zoomLevel / 2;
  this.camera.orthoRight = this.zoomLevel / 2;
  this.camera.orthoTop = this.camera.orthoRight * ratio;
  this.camera.orthoBottom = this.camera.orthoLeft * ratio;
}

Controls.prototype._zoomToPoint = function (zoomDelta = 0) {
  const {width, height} = this.engine.getRenderingCanvasClientRect() || {};
  const totalX = Math.abs(this.camera.orthoLeft - this.camera.orthoRight);
  const totalY = Math.abs(this.camera.orthoTop - this.camera.orthoBottom);
  const aspectRatio = totalY / totalX;

  const target = BABYLON.Vector3.Unproject(
    new BABYLON.Vector3(this.scene.pointerX, this.scene.pointerY, 0),
    width,
    height,
    this.camera.getWorldMatrix(),
    this.camera.getViewMatrix(),
    this.camera.getProjectionMatrix()
  );

  const fromCoord = {
    left: this.camera.orthoLeft - target.x,
    right: this.camera.orthoRight - target.x,
    top: this.camera.orthoTop - target.y,
    bottom: this.camera.orthoBottom - target.y
  }

  const ratio = {
    left: fromCoord.left / totalX,
    right: fromCoord.right / totalX,
    top: fromCoord.top / totalY,
    bottom: fromCoord.bottom / totalY
  }

  this.zoomLevel -= zoomDelta;

  this.camera.targetScreenOffset.x += (ratio.left + ratio.right) * (zoomDelta/2);
  this.camera.targetScreenOffset.y += (ratio.top + ratio.bottom) * (zoomDelta/2) * aspectRatio;

  this.setZoom();
}

Controls.prototype._panToPoint = function ({ type, event }) {
  switch (type) {
    case BABYLON.PointerEventTypes.POINTERDOWN:
      this.oldX = this.scene.pointerX;
      this.oldY = this.scene.pointerY;

      if (event.button == 1) {
        // enable custom panning 
        this.panning = true;
        this.camera.detachControl();
      }

      break;

    case BABYLON.PointerEventTypes.POINTERUP:
      if (event.button == 1) {
        this.panning = false;
        this.camera.attachControl(true);
      }

      break;

    case BABYLON.PointerEventTypes.POINTERMOVE:
      if (this.panning) {
        const {width, height} = this.engine.getRenderingCanvasClientRect() || {};
        const scaleWidth = (this.camera.orthoRight - this.camera.orthoLeft) / width;
        const scaleHeight = (this.camera.orthoBottom - this.camera.orthoTop) / height;
        const scale = Math.max(scaleWidth, scaleHeight);

        const diff = {
          x: this.scene.pointerX - this.oldX || 0,
          y: this.scene.pointerY - this.oldY || 0
        }

        this.oldX = this.scene.pointerX;
        this.oldY = this.scene.pointerY;

        this.camera.targetScreenOffset.x = this.camera.targetScreenOffset.x + (diff.x * scale);
        this.camera.targetScreenOffset.y = this.camera.targetScreenOffset.y - (diff.y * scale);
      }

      break;
  }
}

export default Controls;