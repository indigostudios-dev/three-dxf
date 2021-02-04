import {
  Geometry,
  Vector3,
  Face3,
  MeshBasicMaterial,
  Mesh
} from 'three';

const Solid = (entity) => {
  const geometry = new Geometry();

  const verts = geometry.vertices;
  verts.push(new Vector3(entity.props.points[0].x, entity.props.points[0].y, entity.props.points[0].z));
  verts.push(new Vector3(entity.props.points[1].x, entity.props.points[1].y, entity.props.points[1].z));
  verts.push(new Vector3(entity.props.points[2].x, entity.props.points[2].y, entity.props.points[2].z));
  verts.push(new Vector3(entity.props.points[3].x, entity.props.points[3].y, entity.props.points[3].z));

  // Calculate which direction the points are facing (clockwise or counter-clockwise)
  const vector1 = new Vector3();
  const vector2 = new Vector3();
  vector1.subVectors(verts[1], verts[0]);
  vector2.subVectors(verts[2], verts[0]);
  vector1.cross(vector2);

  // If z < 0 then we must draw these in reverse order
  if (vector1.z < 0) {
    geometry.faces.push(new Face3(2, 1, 0));
    geometry.faces.push(new Face3(2, 3, 1));
  } else {
    geometry.faces.push(new Face3(0, 1, 2));
    geometry.faces.push(new Face3(1, 3, 2));
  }

  const material = new MeshBasicMaterial({
    color: entity.getColor()
  });

  return new Mesh(geometry, material);
}

export default Solid;