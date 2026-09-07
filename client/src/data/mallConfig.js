// Shared constants describing the 3D mall's world layout.
// Store/product positions themselves come from the database (Store.location),
// these are just the fixed structural values for the environment shell.
export const MALL = {
  FLOOR_ELEVATION: 4.2, // vertical rise per floor level
  ATRIUM_RADIUS: 9,
  BOUNDARY: { minX: -26, maxX: 26, minZ: -20, maxZ: 26 },
  ENTRANCE_Z: 22,
  PLAYER_HEIGHT: 1.6,
  PLAYER_RADIUS: 0.45,
  STORE_WIDTH: 8,
  STORE_DEPTH: 6,
  WALK_SPEED: 5.5,
  RUN_SPEED: 9,
};
