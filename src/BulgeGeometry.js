import {
  Vector2,
  Vector3
} from '@babylonjs/core/Legacy/legacy';

import { polar, angle2 } from './Math';

/**
 * Calculates points for a curve between two points
 * @param startPoint - the starting point of the curve
 * @param endPoint - the ending point of the curve
 * @param bulge - a value indicating how much to curve
 * @param segments - number of segments between the two given points
 */
function BulgeGeometry(startPoint, endPoint, bulge, segments) {
  const vertices = [];

  const p0 = startPoint ? new Vector2(startPoint.x, startPoint.y) : new Vector2(0, 0);
  const p1 = endPoint ? new Vector2(endPoint.x, endPoint.y) : new Vector2(1, 0);
  bulge = bulge || 1;

  const angle = 4 * Math.atan(bulge);
  const radius = Vector2.Distance(p0, p1) / 2 / Math.sin(angle / 2);
  const center = polar(startPoint, radius, angle2(p0, p1) + (Math.PI / 2 - angle / 2));

  segments = segments || Math.max(Math.abs(Math.ceil(angle / (Math.PI / 18))), 6); // By default want a segment roughly every 10 degrees
  const startAngle = angle2(center, p0);
  const thetaAngle = angle / segments;

  vertices.push(new Vector3(p0.x, p0.y, 0));

  for (let i = 1; i <= segments; i++) {
    const vertex = polar(center, Math.abs(radius), startAngle + thetaAngle * i);

    vertices.push(new Vector3(vertex.x, vertex.y, 0));
  }

  return vertices;
};

export default BulgeGeometry;