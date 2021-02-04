import * as THREE from 'three';

import OrbitControls from './OrbitControls';
import Entity from './Entity';

/**
 * Viewer class for a dxf object.
 * @param {Object} data - the dxf object
 * @param {Object} parent - the parent element to which we attach the rendering canvas
 * @param {Number} viewerWidth - width of the rendering canvas in pixels
 * @param {Number} viewerHeight - height of the rendering canvas in pixels
 * @param {Object} font - a font loaded with THREE.FontLoader 
 * @constructor
 */
function Viewer(data, parent, viewerWidth, viewerHeight, font) {
  const scene = this.scene = new THREE.Scene();

  // Provide entity class access to common objects
  Entity.prototype.source = data;
  Entity.prototype.font = font;
  Entity.prototype.scene = scene;

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

  for (let i = 0; i < data.entities.length; i++) {
    const { type, ...props } = data.entities[i];

    const { entity } = new Entity(type, props);

    if (entity) {
      const bbox = new THREE.Box3().setFromObject(entity);
      
      if (bbox.min.x && ((dims.min.x === false) || (dims.min.x > bbox.min.x))) dims.min.x = bbox.min.x;
      if (bbox.min.y && ((dims.min.y === false) || (dims.min.y > bbox.min.y))) dims.min.y = bbox.min.y;
      if (bbox.min.z && ((dims.min.z === false) || (dims.min.z > bbox.min.z))) dims.min.z = bbox.min.z;
      if (bbox.max.x && ((dims.max.x === false) || (dims.max.x < bbox.max.x))) dims.max.x = bbox.max.x;
      if (bbox.max.y && ((dims.max.y === false) || (dims.max.y < bbox.max.y))) dims.max.y = bbox.max.y;
      if (bbox.max.z && ((dims.max.z === false) || (dims.max.z < bbox.max.z))) dims.max.z = bbox.max.z;
      
      scene.add(entity);
    }
  }

  const width = viewerWidth || parent.clientWidth;
  const height = viewerHeight || parent.clientHeight;
  const aspectRatio = width / height;

  const upperRightCorner = {
    x: dims.max.x,
    y: dims.max.y
  };
  const lowerLeftCorner = {
    x: dims.min.x,
    y: dims.min.y
  };

  // Figure out the current viewport extents
  let vp_width = upperRightCorner.x - lowerLeftCorner.x;
  let vp_height = upperRightCorner.y - lowerLeftCorner.y;
  const center = center || {
    x: vp_width / 2 + lowerLeftCorner.x,
    y: vp_height / 2 + lowerLeftCorner.y
  };

  // Fit all objects into current ThreeDXF viewer
  const extentsAspectRatio = Math.abs(vp_width / vp_height);
  if (aspectRatio > extentsAspectRatio) {
    vp_width = vp_height * aspectRatio;
  } else {
    vp_height = vp_width / aspectRatio;
  }

  const viewPort = {
    bottom: -vp_height / 2,
    left: -vp_width / 2,
    top: vp_height / 2,
    right: vp_width / 2,
    center: {
      x: center.x,
      y: center.y
    }
  };

  const camera = this.camera = new THREE.OrthographicCamera(viewPort.left, viewPort.right, viewPort.top, viewPort.bottom, 1, 19);
  camera.position.z = 10;
  camera.position.x = viewPort.center.x;
  camera.position.y = viewPort.center.y;

  const renderer = this.renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.setClearColor(0xfffffff, 1);

  parent.appendChild(renderer.domElement);
  parent.style.display = 'block';

  //TODO: Need to make this an option somehow so others can roll their own controls.
  const controls = new OrbitControls(camera, parent);
  controls.target.x = camera.position.x;
  controls.target.y = camera.position.y;
  controls.target.z = 0;
  controls.zoomSpeed = 3;

  //Uncomment this to disable rotation (does not make much sense with 2D drawings).
  //controls.enableRotate = false;

  controls.addEventListener('change', this.render.bind(this));
  this.render();
  controls.update();
}

Viewer.prototype.info = function() {
  console.log( this.renderer.info );
}

Viewer.prototype.render = function() {
  this.renderer.render(this.scene, this.camera)
}

Viewer.prototype.resize = function(width, height) {
  const originalWidth = this.renderer.domElement.width;
  const originalHeight = this.renderer.domElement.height;

  const hscale = width / originalWidth;
  const vscale = height / originalHeight;

  camera.top = (vscale * camera.top);
  camera.bottom = (vscale * camera.bottom);
  camera.left = (hscale * camera.left);
  camera.right = (hscale * camera.right);

  //        camera.updateProjectionMatrix();

  this.renderer.setSize(width, height);
  this.renderer.setClearColor(0xfffffff, 1);
  this.render();
};

export default Viewer