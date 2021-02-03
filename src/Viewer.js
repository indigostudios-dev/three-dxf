/**
 * Viewer class for a dxf object.
 * @param {Object} data - the dxf object
 * @param {Object} parent - the parent element to which we attach the rendering canvas
 * @param {Number} width - width of the rendering canvas in pixels
 * @param {Number} height - height of the rendering canvas in pixels
 * @param {Object} font - a font loaded with THREE.FontLoader 
 * @constructor
 */

import * as THREE from 'three';
import OrbitControls from './OrbitControls';
import THREEx from './Extensions';

function Viewer(data, parent, props={}) {
  createLineTypeShaders(data);

  const scene = new THREE.Scene();
  props.scene = scene;

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
    const obj = drawEntity({
      entity: data.entities[i],
      data,
      props
    });

    if (obj) {
      const bbox = new THREE.Box3().setFromObject(obj);
      if (bbox.min.x && ((dims.min.x === false) || (dims.min.x > bbox.min.x))) dims.min.x = bbox.min.x;
      if (bbox.min.y && ((dims.min.y === false) || (dims.min.y > bbox.min.y))) dims.min.y = bbox.min.y;
      if (bbox.min.z && ((dims.min.z === false) || (dims.min.z > bbox.min.z))) dims.min.z = bbox.min.z;
      if (bbox.max.x && ((dims.max.x === false) || (dims.max.x < bbox.max.x))) dims.max.x = bbox.max.x;
      if (bbox.max.y && ((dims.max.y === false) || (dims.max.y < bbox.max.y))) dims.max.y = bbox.max.y;
      if (bbox.max.z && ((dims.max.z === false) || (dims.max.z < bbox.max.z))) dims.max.z = bbox.max.z;
      scene.add(obj);
    }
  }

  const width = props.width || parent.clientWidth;
  const height = props.height || parent.clientHeight;
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

  const camera = new THREE.OrthographicCamera(viewPort.left, viewPort.right, viewPort.top, viewPort.bottom, 1, 19);
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

  this.render = function () {
    renderer.render(scene, camera)
  };
  controls.addEventListener('change', this.render);
  this.render();
  controls.update();

  this.resize = function (width, height) {
    const originalWidth = renderer.domElement.width;
    const originalHeight = renderer.domElement.height;

    const hscale = width / originalWidth;
    const vscale = height / originalHeight;


    camera.top = (vscale * camera.top);
    camera.bottom = (vscale * camera.bottom);
    camera.left = (hscale * camera.left);
    camera.right = (hscale * camera.right);

    //        camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setClearColor(0xfffffff, 1);
    this.render();
  };
}

function drawEntity(props) {
  const {entity} = props;

  switch (entity.type) {
    case 'CIRCLE':
    case 'ARC':
      return drawArc(props);
    case 'POLYLINE':
    case 'LWPOLYLINE':
    case 'LINE':
      return drawLine(props);
    case 'TEXT':
      return drawText(props);
    case 'SOLID':
      return drawSolid(props);
    case 'POINT':
      return drawPoint(props);
    case 'INSERT':
      return drawBlock(props);
    case 'SPLINE':
      return drawSpline(props);
    case 'MTEXT':
      return drawMtext(props);
    case 'ELLIPSE':
      return drawEllipse(props);
    case 'DIMENSION':
      const dimTypeEnum = entity.dimensionType & 7;

      if (dimTypeEnum === 0) {
       return drawDimension(props);
      } else {
        console.log("Unsupported Dimension type: " + dimTypeEnum);
      }
      break;
    default:
      console.log("Unsupported Entity Type: " + entity.type);
  }
}

function drawEllipse({entity, data}) {
  const color = getColor(entity, data);

  const xrad = Math.sqrt(Math.pow(entity.majorAxisEndPoint.x, 2) + Math.pow(entity.majorAxisEndPoint.y, 2));
  const yrad = xrad * entity.axisRatio;
  const rotation = Math.atan2(entity.majorAxisEndPoint.y, entity.majorAxisEndPoint.x);

  const curve = new THREE.EllipseCurve(
    entity.center.x, entity.center.y,
    xrad, yrad,
    entity.startAngle, entity.endAngle,
    false, // Always counterclockwise
    rotation
  );

  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    linewidth: 1,
    color: color
  });

  // Create the final object to add to the scene
  const ellipse = new THREE.Line(geometry, material);
  return ellipse;
}

function drawMtext({entity, data, props}) {
  const color = getColor(entity, data);

  if (!props.font) {
    return console.log('font parameter not set. Ignoring text entity.')
  }

  const geometry = new THREE.TextGeometry(entity.text, {
    font: props.font,
    size: entity.height * (4 / 5),
    height: 1
  });
  const material = new THREE.MeshBasicMaterial({
    color: color
  });
  const text = new THREE.Mesh(geometry, material);

  // Measure what we rendered.
  const measure = new THREE.Box3();
  measure.setFromObject(text);

  const textWidth = measure.max.x - measure.min.x;

  // If the text ends up being wider than the box, it's supposed
  // to be multiline. Doing that in threeJS is overkill.
  if (textWidth > entity.width) {
    console.log("Can't render this multipline MTEXT entity, sorry.", entity);
    return undefined;
  }

  text.position.z = 0;
  switch (entity.attachmentPoint) {
    case 1:
      // Top Left
      text.position.x = entity.position.x;
      text.position.y = entity.position.y - entity.height;
      break;
    case 2:
      // Top Center
      text.position.x = entity.position.x - textWidth / 2;
      text.position.y = entity.position.y - entity.height;
      break;
    case 3:
      // Top Right
      text.position.x = entity.position.x - textWidth;
      text.position.y = entity.position.y - entity.height;
      break;

    case 4:
      // Middle Left
      text.position.x = entity.position.x;
      text.position.y = entity.position.y - entity.height / 2;
      break;
    case 5:
      // Middle Center
      text.position.x = entity.position.x - textWidth / 2;
      text.position.y = entity.position.y - entity.height / 2;
      break;
    case 6:
      // Middle Right
      text.position.x = entity.position.x - textWidth;
      text.position.y = entity.position.y - entity.height / 2;
      break;

    case 7:
      // Bottom Left
      text.position.x = entity.position.x;
      text.position.y = entity.position.y;
      break;
    case 8:
      // Bottom Center
      text.position.x = entity.position.x - textWidth / 2;
      text.position.y = entity.position.y;
      break;
    case 9:
      // Bottom Right
      text.position.x = entity.position.x - textWidth;
      text.position.y = entity.position.y;
      break;

    default:
      return undefined;
  };

  return text;
}

function drawSpline({entity, data}) {
  const color = getColor(entity, data);

  const points = entity.controlPoints.map(function (vec) {
    return new THREE.Vector2(vec.x, vec.y);
  });

  const interpolatedPoints = [];
  let curve;

  if (entity.degreeOfSplineCurve === 2 || entity.degreeOfSplineCurve === 3) {
    const i = 0
    for (i = 0; i + 2 < points.length; i = i + 2) {
      if (entity.degreeOfSplineCurve === 2) {
        curve = new THREE.QuadraticBezierCurve(points[i], points[i + 1], points[i + 2]);
      } else {
        curve = new THREE.QuadraticBezierCurve3(points[i], points[i + 1], points[i + 2]);
      }
      interpolatedPoints.push.apply(interpolatedPoints, curve.getPoints(50));
    }
    if (i < points.length) {
      curve = new THREE.QuadraticBezierCurve3(points[i], points[i + 1], points[i + 1]);
      interpolatedPoints.push.apply(interpolatedPoints, curve.getPoints(50));
    }
  } else {
    curve = new THREE.SplineCurve(points);
    interpolatedPoints = curve.getPoints(100);
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(interpolatedPoints);
  const material = new THREE.LineBasicMaterial({
    linewidth: 1,
    color: color
  });
  const splineObject = new THREE.Line(geometry, material);

  return splineObject;
}

function drawLine({entity, data}) {
  const geometry = new THREE.Geometry(),
        color = getColor(entity, data);

  let lineType;

  if (!entity.vertices) return console.log('entity missing vertices.');

  // create geometry
  for (let i = 0; i < entity.vertices.length; i++) {

    if (entity.vertices[i].bulge) {
      const bulge = entity.vertices[i].bulge;
      const startPoint = entity.vertices[i];
      const endPoint = i + 1 < entity.vertices.length ? entity.vertices[i + 1] : geometry.vertices[0];

      const bulgeGeometry = new THREEx.BulgeGeometry(startPoint, endPoint, bulge);

      geometry.vertices.push.apply(geometry.vertices, bulgeGeometry.vertices);
    } else {
      const vertex = entity.vertices[i];
      geometry.vertices.push(new THREE.Vector3(vertex.x, vertex.y, 0));
    }

  }

  if (entity.shape) geometry.vertices.push(geometry.vertices[0]);

  // set material
  if (entity.lineType) {
    lineType = data.tables.lineType.lineTypes[entity.lineType];
  }

  const material = lineType && lineType.pattern && lineType.pattern.length !== 0
    ? new THREE.LineDashedMaterial({
        color: color,
        gapSize: 4,
        dashSize: 4
      })
    : new THREE.LineBasicMaterial({
        linewidth: 1,
        color: color
      })


  const line = new THREE.Line(geometry, material);

  return line;
}

function drawArc({entity, data}) {
  let startAngle, endAngle;

  if (entity.type === 'CIRCLE') {
    startAngle = entity.startAngle || 0;
    endAngle = startAngle + 2 * Math.PI;
  } else {
    startAngle = entity.startAngle;
    endAngle = entity.endAngle;
  }

  const curve = new THREE.ArcCurve(
    0, 0,
    entity.radius,
    startAngle,
    endAngle);

  const points = curve.getPoints(32);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const material = new THREE.LineBasicMaterial({
    color: getColor(entity, data)
  });

  const arc = new THREE.Line(geometry, material);
  arc.position.x = entity.center.x;
  arc.position.y = entity.center.y;
  arc.position.z = entity.center.z;

  return arc;
}

function drawSolid({entity, data}) {
  const geometry = new THREE.Geometry();

  const verts = geometry.vertices;
  verts.push(new THREE.Vector3(entity.points[0].x, entity.points[0].y, entity.points[0].z));
  verts.push(new THREE.Vector3(entity.points[1].x, entity.points[1].y, entity.points[1].z));
  verts.push(new THREE.Vector3(entity.points[2].x, entity.points[2].y, entity.points[2].z));
  verts.push(new THREE.Vector3(entity.points[3].x, entity.points[3].y, entity.points[3].z));

  // Calculate which direction the points are facing (clockwise or counter-clockwise)
  const vector1 = new THREE.Vector3();
  const vector2 = new THREE.Vector3();
  vector1.subVectors(verts[1], verts[0]);
  vector2.subVectors(verts[2], verts[0]);
  vector1.cross(vector2);

  // If z < 0 then we must draw these in reverse order
  if (vector1.z < 0) {
    geometry.faces.push(new THREE.Face3(2, 1, 0));
    geometry.faces.push(new THREE.Face3(2, 3, 1));
  } else {
    geometry.faces.push(new THREE.Face3(0, 1, 2));
    geometry.faces.push(new THREE.Face3(1, 3, 2));
  }


  const material = new THREE.MeshBasicMaterial({
    color: getColor(entity, data)
  });

  return new THREE.Mesh(geometry, material);

}

function drawText({entity, data, props}) {
  if (!props.font)
    return console.warn('Text is not supported without a Three.js font loaded with THREE.FontLoader! Load a font of your choice and pass this into the constructor. See the sample for this repository or Three.js examples at http://threejs.org/examples/?q=text#webgl_geometry_text for more details.');

  const geometry = new THREE.TextGeometry(entity.text, {
    font: props.font,
    height: 0,
    size: entity.textHeight || 12
  });

  if (entity.rotation) {
    const zRotation = entity.rotation * Math.PI / 180;
    geometry.rotateZ(zRotation);
  }

  const material = new THREE.MeshBasicMaterial({
    color: getColor(entity, data)
  });

  const text = new THREE.Mesh(geometry, material);
  text.position.x = entity.startPoint.x;
  text.position.y = entity.startPoint.y;
  text.position.z = entity.startPoint.z;

  return text;
}

function drawPoint({entity, data, props}) {
  const {scene} = props;

  const geometry = new THREE.Geometry();

  geometry.vertices.push(new THREE.Vector3(entity.position.x, entity.position.y, entity.position.z));

  // TODO: could be more efficient. PointCloud per layer?

  const numPoints = 1;

  const color = getColor(entity, data);
  const colors = new Float32Array(numPoints * 3);
  colors[0] = color.r;
  colors[1] = color.g;
  colors[2] = color.b;

  geometry.colors = colors;
  geometry.computeBoundingBox();

  const material = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: THREE.VertexColors
  });

  const point = new THREE.Points(geometry, material);
  scene.add(point);
}

function drawDimension({entity, data, props}) {
  const block = data.blocks[entity.block];

  if (!block || !block.entities) return null;

  const group = new THREE.Object3D();
  // if(entity.anchorPoint) {
  //     group.position.x = entity.anchorPoint.x;
  //     group.position.y = entity.anchorPoint.y;
  //     group.position.z = entity.anchorPoint.z;
  // }

  for (let i = 0; i < block.entities.length; i++) {
    const childEntity = drawEntity({
      entity: block.entities[i],
      data,
      group,
      props
    });

    if (childEntity) group.add(childEntity);
  }

  return group;
}

function drawBlock({entity, data, props}) {
  const block = data.blocks[entity.name];

  if (!block.entities) return null;

  const group = new THREE.Object3D()

  if (entity.xScale) group.scale.x = entity.xScale;
  if (entity.yScale) group.scale.y = entity.yScale;

  if (entity.rotation) {
    group.rotation.z = entity.rotation * Math.PI / 180;
  }

  if (entity.position) {
    group.position.x = entity.position.x;
    group.position.y = entity.position.y;
    group.position.z = entity.position.z;
  }

  for (let i = 0; i < block.entities.length; i++) {
    const childEntity = drawEntity({
      entity: block.entities[i],
      data,
      group,
      props
    });
    if (childEntity) group.add(childEntity);
  }

  return group;
}

function getColor(entity, data) {
  let color = 0x000000; //default

  if (entity.color) {
    color = entity.color;
  } else if (data.tables && data.tables.layer && data.tables.layer.layers[entity.layer]) {
    color = data.tables.layer.layers[entity.layer].color;
  }

  if (color == null || color === 0xffffff) {
    color = 0x000000;
  }
  return color;
}

function createLineTypeShaders(data) {
  if (!data.tables || !data.tables.lineType) return;
  const ltypes = data.tables.lineType.lineTypes;

  for (let type in ltypes) {
    const ltype = ltypes[type];
    if (!ltype.pattern) continue;
    ltype.material = createDashedLineShader(ltype.pattern);
  }
}

function createDashedLineShader(pattern) {
  const dashedLineShader = {};
  let totalLength = 0.0;

  for (let i = 0; i < pattern.length; i++) {
    totalLength += Math.abs(pattern[i]);
  }

  dashedLineShader.uniforms = THREE.UniformsUtils.merge([

    THREE.UniformsLib['common'],
    THREE.UniformsLib['fog'],

    {
      'pattern': {
        type: 'fv1',
        value: pattern
      },
      'patternLength': {
        type: 'f',
        value: totalLength
      }
    }

  ]);

  dashedLineShader.vertexShader = [
    'attribute float lineDistance;',

    'varying float vLineDistance;',

    THREE.ShaderChunk['color_pars_vertex'],

    'void main() {',

    THREE.ShaderChunk['color_vertex'],

    'vLineDistance = lineDistance;',

    'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

    '}'
  ].join('\n');

  dashedLineShader.fragmentShader = [
    'uniform vec3 diffuse;',
    'uniform float opacity;',

    'uniform float pattern[' + pattern.length + '];',
    'uniform float patternLength;',

    'varying float vLineDistance;',

    THREE.ShaderChunk['color_pars_fragment'],
    THREE.ShaderChunk['fog_pars_fragment'],

    'void main() {',

    'float pos = mod(vLineDistance, patternLength);',

    'for ( int i = 0; i < ' + pattern.length + '; i++ ) {',
    'pos = pos - abs(pattern[i]);',
    'if( pos < 0.0 ) {',
    'if( pattern[i] > 0.0 ) {',
    'gl_FragColor = vec4(1.0, 0.0, 0.0, opacity );',
    'break;',
    '}',
    'discard;',
    '}',

    '}',

    THREE.ShaderChunk['color_fragment'],
    THREE.ShaderChunk['fog_fragment'],

    '}'
  ].join('\n');

  return dashedLineShader;
}

export default Viewer