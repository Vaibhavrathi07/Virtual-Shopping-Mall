import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

const SHAPES = {
  box: <boxGeometry args={[0.6, 0.6, 0.6]} />,
  sphere: <sphereGeometry args={[0.4, 24, 24]} />,
  cylinder: <cylinderGeometry args={[0.35, 0.35, 0.7, 20]} />,
  cone: <coneGeometry args={[0.4, 0.8, 20]} />,
  torus: <torusGeometry args={[0.35, 0.14, 16, 32]} />,
};

export default function ProductObject({ product, position, accentColor, onSelect }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.5;
    const targetScale = hovered ? 1.25 : 1;
    meshRef.current.scale.lerp(
      { x: targetScale, y: targetScale, z: targetScale },
      0.15
    );
  });

  const geometry = SHAPES[product.fallbackShape] || SHAPES.box;

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        castShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(product);
        }}
      >
        {geometry}
        <meshStandardMaterial
          color={hovered ? accentColor : "#cfcfe0"}
          emissive={hovered ? accentColor : "#000000"}
          emissiveIntensity={hovered ? 0.6 : 0}
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>
      {/* Small display pedestal */}
      <mesh position={[0, -0.55, 0]} receiveShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.1, 20]} />
        <meshStandardMaterial color="#111118" metalness={0.6} roughness={0.3} />
      </mesh>
      {hovered && (
        <Text position={[0, 0.75, 0]} fontSize={0.16} color="#ffffff" anchorX="center" maxWidth={1.6}>
          {product.name}
        </Text>
      )}
    </group>
  );
}
