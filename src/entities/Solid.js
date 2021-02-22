import {
  Vector3,
  Vector2
} from '@babylonjs/core/Legacy/legacy';

import earcut from 'earcut';

const Solid = (entity) => {
  const corners = [
    new BABYLON.Vector2(entity.props.points[0].x, entity.props.points[0].y),
    new BABYLON.Vector2(entity.props.points[1].x, entity.props.points[1].y),
    new BABYLON.Vector2(entity.props.points[2].x, entity.props.points[2].y),
    new BABYLON.Vector2(entity.props.points[3].x, entity.props.points[3].y),
  ];

  const mat = new BABYLON.StandardMaterial("mat");
  mat.diffuseColor = entity.getColor();
  
  const poly_tri = new BABYLON.PolygonMeshBuilder(entity.props.handle, corners, null, earcut);
  const polygon = poly_tri.build(false, 3);
  polygon.rotation.x = -90 * Math.PI / 180
  polygon.material = mat;

  polygon.layerMask =  0x000003;

  return polygon;
}

export default Solid;