import { useMemo } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { MALL } from "../../data/mallConfig";

function Floor({ y = 0, color = "#1c1c2b", size = 60 }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color={color} roughness={0.35} metalness={0.15} />
    </mesh>
  );
}

function Wall({ position, size, rotationY = 0 }) {
  return (
    <mesh position={position} rotation={[0, rotationY, 0]} receiveShadow castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#22223a" roughness={0.8} metalness={0.05} />
    </mesh>
  );
}

function Plant({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.4, 0.6, 16]} />
        <meshStandardMaterial color="#3a3a2a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1, 0]} castShadow>
        <coneGeometry args={[0.55, 1.4, 8]} />
        <meshStandardMaterial color="#1f7a4d" roughness={0.7} />
      </mesh>
    </group>
  );
}

function Bench({ position, rotationY = 0 }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]} castShadow>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.6, 0.08, 0.5]} />
        <meshStandardMaterial color="#5c4a3a" roughness={0.6} />
      </mesh>
      {[-0.65, 0.65].map((dx) => (
        <mesh key={dx} position={[dx, 0.2, 0]} castShadow>
          <boxGeometry args={[0.1, 0.4, 0.45]} />
          <meshStandardMaterial color="#2a2a3d" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function AdScreen({ position, rotationY = 0, text, color }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh castShadow>
        <boxGeometry args={[3.2, 1.8, 0.08]} />
        <meshStandardMaterial color="#050508" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[3, 1.6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} toneMapped={false} />
      </mesh>
      <Text position={[0, 0, 0.06]} fontSize={0.28} color="#0a0a12" anchorX="center" anchorY="middle" maxWidth={2.6}>
        {text}
      </Text>
    </group>
  );
}

function Escalator() {
  // Visual steps rising alongside the physical ramp in Player.jsx (RAMP constants).
  const steps = useMemo(() => {
    const arr = [];
    const count = 14;
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      arr.push({
        z: 2 + t * 7,
        y: t * MALL.FLOOR_ELEVATION,
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {steps.map((s, i) => (
        <mesh key={i} position={[0, s.y, s.z]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.25, 0.7]} />
          <meshStandardMaterial color="#33334a" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      {[-1.9, 1.9].map((dx) => (
        <mesh key={dx} position={[dx, MALL.FLOOR_ELEVATION / 2 + 0.5, 5.5]} castShadow>
          <boxGeometry args={[0.08, MALL.FLOOR_ELEVATION + 1.2, 8.2]} />
          <meshStandardMaterial color="#7c5cff" emissive="#7c5cff" emissiveIntensity={0.25} metalness={0.4} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function FoodCourt() {
  return (
    <group position={[0, 0, -18]}>
      <Text position={[0, 3.4, -1]} fontSize={0.9} color="#22d3ee" font={undefined}>
        FOOD COURT
      </Text>
      {[-6, -2, 2, 6].map((x, i) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[2.4, 2.4, 0.3]} />
            <meshStandardMaterial color={["#f97316", "#22c55e", "#ec4899", "#3b82f6"][i]} roughness={0.5} />
          </mesh>
          {[0, 1, 2].map((j) => (
            <group key={j} position={[-0.9 + j * 0.9, 0, 1.4]}>
              <mesh position={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.35, 0.35, 0.06, 12]} />
                <meshStandardMaterial color="#111118" metalness={0.7} roughness={0.3} />
              </mesh>
              <mesh position={[0.4, 0.7, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
                <meshStandardMaterial color="#3a3a4a" metalness={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

function InfoDesk() {
  return (
    <group position={[0, 0, 14]}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[3, 1.2, 1.2]} />
        <meshStandardMaterial color="#12121e" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <boxGeometry args={[3.05, 0.06, 1.25]} />
        <meshStandardMaterial color="#7c5cff" emissive="#7c5cff" emissiveIntensity={0.4} />
      </mesh>
      <Text position={[0, 1.9, 0]} fontSize={0.35} color="#e8e8f0" anchorX="center">
        INFORMATION
      </Text>
    </group>
  );
}

export default function MallEnvironment() {
  return (
    <group>
      {/* Lighting: ambient fill + directional sun + accent point lights (per CG requirements) */}
      <ambientLight intensity={0.35} color="#8888ff" />
      <directionalLight
        position={[15, 25, 10]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <pointLight position={[0, 8, 0]} intensity={0.6} color="#7c5cff" distance={30} />
      <pointLight position={[0, 6, -18]} intensity={0.5} color="#22d3ee" distance={20} />
      <spotLight position={[0, 10, 14]} angle={0.5} penumbra={0.6} intensity={0.7} color="#ffffff" />

      {/* Floors */}
      <Floor y={0} size={56} />
      <Floor y={MALL.FLOOR_ELEVATION} size={30} color="#1a1a28" />

      {/* Perimeter walls (floor 1) */}
      <Wall position={[0, 4, MALL.BOUNDARY.minZ]} size={[52, 8, 0.4]} />
      <Wall position={[MALL.BOUNDARY.minX, 4, 3]} size={[0.4, 8, 34]} rotationY={0} />
      <Wall position={[MALL.BOUNDARY.maxX, 4, 3]} size={[0.4, 8, 34]} rotationY={0} />

      {/* Entrance archway */}
      <group position={[0, 0, MALL.BOUNDARY.maxZ]}>
        <Text position={[0, 6.5, 0]} fontSize={1.4} color="#7c5cff" font={undefined}>
          VIRTUAL MALL
        </Text>
      </group>

      <Escalator />
      <InfoDesk />
      <FoodCourt />

      {/* Decor scattered through the atrium */}
      {[[-4, 6], [4, 6], [-8, -2], [8, -2], [-14, 4], [14, 4]].map(([x, z], i) => (
        <Plant key={i} position={[x, 0, z]} />
      ))}
      {[[-3, 16, 0], [3, 16, Math.PI]].map(([x, z, r], i) => (
        <Bench key={i} position={[x, 0, z]} rotationY={r} />
      ))}

      <AdScreen position={[-9, 3.5, 4]} rotationY={Math.PI / 6} text="SEASON SALE — UP TO 40% OFF" color="#7c5cff" />
      <AdScreen position={[9, 3.5, 4]} rotationY={-Math.PI / 6} text="NEW ARRIVALS EVERY WEEK" color="#22d3ee" />
    </group>
  );
}
