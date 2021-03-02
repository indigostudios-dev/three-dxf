import {
  Vector2
} from '@babylonjs/core';

/**
 * Returns the angle in radians of the vector (p1,p2). In other words, imagine
 * putting the base of the vector at coordinates (0,0) and finding the angle
 * from vector (1,0) to (p1,p2).
 * @param  {Object} p1 start point of the vector
 * @param  {Object} p2 end point of the vector
 * @return {Number} the angle
 */
const angle2 = (p1, p2) => {
  var v1 = new Vector2(p1.x, p1.y);
  var v2 = new Vector2(p2.x, p2.y);
  v2.subtractInPlace(v1); // sets v2 to be our chord
  v2.normalize();

  if (v2.y < 0) return -Math.acos(v2.x);
  return Math.acos(v2.x);
}

const polar = (point, distance, angle) => {
  var result = {
    x: point.x + distance * Math.cos(angle),
    y: point.y + distance * Math.sin(angle)
  };

  return result;
}

export {
  angle2,
  polar
};