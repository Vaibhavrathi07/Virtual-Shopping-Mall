import { useRef, useEffect, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import { MALL } from "../../data/mallConfig";
import useMallStore from "../../store/useMallStore";

// Ramp/escalator strip that connects floor 1 (y=0) to floor 2 (y=FLOOR_ELEVATION).
// Player y is derived from z position while inside this strip so walking
// "up the escalator" is a real, physically continuous transformation.
const RAMP = { minX: -5, maxX: 5, startZ: 2, endZ: 9 };

function getFloorHeight(x, z) {
  if (x >= RAMP.minX && x <= RAMP.maxX && z >= RAMP.startZ && z <= RAMP.endZ) {
    const t = (z - RAMP.startZ) / (RAMP.endZ - RAMP.startZ);
    return THREE.MathUtils.clamp(t, 0, 1) * MALL.FLOOR_ELEVATION;
  }
  if (z > RAMP.endZ) return MALL.FLOOR_ELEVATION;
  return 0;
}

function collides(nextX, nextZ, obstacles) {
  const r = MALL.PLAYER_RADIUS;
  for (const ob of obstacles) {
    const halfW = ob.width / 2 + r;
    const halfD = ob.depth / 2 + r;
    if (
      nextX > ob.x - halfW &&
      nextX < ob.x + halfW &&
      nextZ > ob.z - halfD &&
      nextZ < ob.z + halfD
    ) {
      return true;
    }
  }
  return false;
}

export default function Player({ obstacles = [], onPointerLockChange, navigateTarget }) {
  const { camera } = useThree();
  const controlsRef = useRef();
  const keys = useRef({});
  const setPlayerPosition = useMallStore((s) => s.setPlayerPosition);
  const controlMode = useMallStore((s) => s.controlMode);
  const touchMove = useMallStore((s) => s.touchMove);
  const touchLook = useMallStore((s) => s.touchLook);
  const consumeTouchLook = useMallStore((s) => s.consumeTouchLook);
  const yaw = useRef(Math.PI);

  useEffect(() => {
    camera.position.set(0, MALL.PLAYER_HEIGHT, MALL.ENTRANCE_Z);
  }, [camera]);

  useEffect(() => {
    const down = (e) => (keys.current[e.code] = true);
    const up = (e) => (keys.current[e.code] = false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Smoothly walk the player toward a target when "Take me to store" is used.
  useFrame((_, delta) => {
    if (navigateTarget) {
      const dir = new THREE.Vector3(
        navigateTarget.x - camera.position.x,
        0,
        navigateTarget.z - camera.position.z
      );
      const dist = dir.length();
      if (dist > 0.5) {
        dir.normalize();
        const step = MALL.RUN_SPEED * delta;
        const nextX = camera.position.x + dir.x * step;
        const nextZ = camera.position.z + dir.z * step;
        if (!collides(nextX, camera.position.z, obstacles)) camera.position.x = nextX;
        if (!collides(camera.position.x, nextZ, obstacles)) camera.position.z = nextZ;
        camera.position.y = getFloorHeight(camera.position.x, camera.position.z) + MALL.PLAYER_HEIGHT;
      }
    } else if (controlMode === "touch") {
      if (touchLook.x !== 0 || touchLook.y !== 0) {
        yaw.current -= touchLook.x * 0.0025;
        camera.rotation.order = "YXZ";
        camera.rotation.y = yaw.current;
        camera.rotation.x = THREE.MathUtils.clamp(
          camera.rotation.x - touchLook.y * 0.0025,
          -Math.PI / 3,
          Math.PI / 3
        );
        consumeTouchLook();
      }
      const forward = touchMove.z;
      const strafe = touchMove.x;
      if (forward !== 0 || strafe !== 0) {
        const speed = MALL.WALK_SPEED * delta;
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        dir.y = 0;
        dir.normalize();
        const right = new THREE.Vector3().crossVectors(dir, camera.up).normalize();
        const moveX = dir.x * forward + right.x * strafe;
        const moveZ = dir.z * forward + right.z * strafe;
        const len = Math.hypot(moveX, moveZ) || 1;
        const nextX = camera.position.x + (moveX / len) * speed;
        const nextZ = camera.position.z + (moveZ / len) * speed;
        const clampedX = THREE.MathUtils.clamp(
          nextX,
          MALL.BOUNDARY.minX + MALL.PLAYER_RADIUS,
          MALL.BOUNDARY.maxX - MALL.PLAYER_RADIUS
        );
        const clampedZ = THREE.MathUtils.clamp(
          nextZ,
          MALL.BOUNDARY.minZ + MALL.PLAYER_RADIUS,
          MALL.BOUNDARY.maxZ - MALL.PLAYER_RADIUS
        );
        if (!collides(clampedX, camera.position.z, obstacles)) camera.position.x = clampedX;
        if (!collides(camera.position.x, clampedZ, obstacles)) camera.position.z = clampedZ;
      }
      camera.position.y = getFloorHeight(camera.position.x, camera.position.z) + MALL.PLAYER_HEIGHT;
    } else if (controlsRef.current?.isLocked) {
      const forward = (keys.current["KeyW"] || keys.current["ArrowUp"] ? 1 : 0) -
        (keys.current["KeyS"] || keys.current["ArrowDown"] ? 1 : 0);
      const strafe = (keys.current["KeyD"] || keys.current["ArrowRight"] ? 1 : 0) -
        (keys.current["KeyA"] || keys.current["ArrowLeft"] ? 1 : 0);

      if (forward !== 0 || strafe !== 0) {
        const speed = MALL.WALK_SPEED * delta;
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        dir.y = 0;
        dir.normalize();
        const right = new THREE.Vector3().crossVectors(dir, camera.up).normalize();

        const moveX = dir.x * forward + right.x * strafe;
        const moveZ = dir.z * forward + right.z * strafe;
        const len = Math.hypot(moveX, moveZ) || 1;

        const nextX = camera.position.x + (moveX / len) * speed;
        const nextZ = camera.position.z + (moveZ / len) * speed;

        const clampedX = THREE.MathUtils.clamp(
          nextX,
          MALL.BOUNDARY.minX + MALL.PLAYER_RADIUS,
          MALL.BOUNDARY.maxX - MALL.PLAYER_RADIUS
        );
        const clampedZ = THREE.MathUtils.clamp(
          nextZ,
          MALL.BOUNDARY.minZ + MALL.PLAYER_RADIUS,
          MALL.BOUNDARY.maxZ - MALL.PLAYER_RADIUS
        );

        if (!collides(clampedX, camera.position.z, obstacles)) camera.position.x = clampedX;
        if (!collides(camera.position.x, clampedZ, obstacles)) camera.position.z = clampedZ;
      }
      camera.position.y = getFloorHeight(camera.position.x, camera.position.z) + MALL.PLAYER_HEIGHT;
    }

    setPlayerPosition({ x: camera.position.x, y: camera.position.y, z: camera.position.z });
  });

  const handleLock = useCallback(() => onPointerLockChange?.(true), [onPointerLockChange]);
  const handleUnlock = useCallback(() => onPointerLockChange?.(false), [onPointerLockChange]);

  if (controlMode === "touch") return null;

  return <PointerLockControls ref={controlsRef} onLock={handleLock} onUnlock={handleUnlock} />;
}

export { getFloorHeight };
