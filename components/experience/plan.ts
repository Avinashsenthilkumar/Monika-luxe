/**
 * Ground-floor plan of the concept villa, in metres (x → right, z → toward the street).
 * Shared by the 3D blueprint lines and the SVG poster/fallback drawing so both always match.
 */
export type Rect = [x0: number, z0: number, x1: number, z1: number];

export const PLAN = {
  /** primary drawn outlines */
  solid: [
    [-11, -8, 11, 7], // plinth
    [-10, -7, -1, 4], // kitchen & entry block
    [-1, -6, 10, 5], // glass living pavilion
    [-1, -6.3, 10, -6], // back wall
    [1.5, -6, 8.5, -5.85], // TV / stone feature wall
    [3.2, -0.7, 6.8, 0.3], // sofa
    [5.8, -2.0, 6.8, -0.7], // chaise
    [4.4, -2.4, 5.6, -1.2], // coffee table
    [-0.3, 2.1, 1.9, 3.1], // dining table
    [-1, 8.5, 10.5, 13], // pool
    [-7.2, 7, -3.8, 8.2], // entrance steps
    [-6.6, 4, -3.4, 6.2], // entrance canopy
  ] as Rect[],
  /** lighter construction / context lines */
  light: [
    [-3, 7, 12.5, 14.5], // pool deck
    [-9, 8.2, -4, 19], // driveway
    [-18, -14, 18, 19], // compound wall
    [-9.5, -7, 3, 4.5], // first floor: bedroom wing
    [3, -7, 10, 2], // first floor: study wing
  ] as Rect[],
  columns: [
    [-1, 5],
    [10, 5],
    [10, -6],
  ] as Array<[number, number]>,
};
