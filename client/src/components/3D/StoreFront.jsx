import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import ProductObject from "./ProductObject";
import { MALL } from "../../data/mallConfig";
import useMallStore from "../../store/useMallStore";

export default function StoreFront({ store, products, onSelectProduct, onEnter }) {
  const { x, y = 0, z, rotationY = 0 } = store.location || {};
  const accent = store.theme?.primaryColor || "#7c5cff";
  const leftDoorRef = useRef();
  const rightDoorRef = useRef();
  const playerPosition = useMallStore((s) => s.playerPosition);

  const width = MALL.STORE_WIDTH;
  const depth = MALL.STORE_DEPTH;

  const productPositions = useMemo(() => {
    const count = Math.min(products.length, 6);
    const spacing = (width - 1.4) / Math.max(count - 1, 1);
    return products.slice(0, 6).map((p, i) => ({
      product: p,
      offsetX: count === 1 ? 0 : -((width - 1.4) / 2) + i * spacing,
    }));
  }, [products, width]);

  useFrame((_, delta) => {
    if (!leftDoorRef.current || !rightDoorRef.current) return;
    const dx = playerPosition.x - x;
    const dz = playerPosition.z - z;
    const dist = Math.hypot(dx, dz);
    const open = dist < 5.5;
    if (open && onEnter) onEnter(store._id, dist < 4);
    const target = open ? 1.1 : 0;
    leftDoorRef.current.position.x = THREE.MathUtils.lerp(leftDoorRef.current.position.x, -0.9 - target, delta * 3);
    rightDoorRef.current.position.x = THREE.MathUtils.lerp(rightDoorRef.current.position.x, 0.9 + target, delta * 3);
  });

  return (
    <group position={[x, y, z]} rotation={[0, rotationY, 0]}>
      {/* Back wall */}
      <mesh position={[0, 3, -depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, 6, 0.3]} />
        <meshStandardMaterial color="#181826" roughness={0.7} />
      </mesh>
      {/* Side walls */}
      <mesh position={[-width / 2, 3, -depth / 4]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 6, depth / 2]} />
        <meshStandardMaterial color="#181826" roughness={0.7} />
      </mesh>
      <mesh position={[width / 2, 3, -depth / 4]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 6, depth / 2]} />
        <meshStandardMaterial color="#181826" roughness={0.7} />
      </mesh>
      {/* Display window glass */}
      <mesh position={[0, 2, depth / 2 - 0.05]}>
        <boxGeometry args={[width - 1, 3.4, 0.05]} />
        <meshPhysicalMaterial color={accent} transparent opacity={0.12} roughness={0.05} metalness={0} transmission={0.6} />
      </mesh>
      {/* Storefront sign */}
      <mesh position={[0, 5.4, depth / 2]}>
        <boxGeometry args={[width - 0.8, 1, 0.15]} />
        <meshStandardMaterial color="#0a0a12" metalness={0.3} roughness={0.4} />
      </mesh>
      <Text
        position={[0, 5.4, depth / 2 + 0.1]}
        fontSize={0.5}
        color={accent}
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {store.name}
      </Text>

      {/* Animated sliding entrance doors */}
      <mesh ref={leftDoorRef} position={[-0.9, 1.6, depth / 2]} castShadow>
        <boxGeometry args={[1.6, 3.2, 0.08]} />
        <meshPhysicalMaterial color={accent} transparent opacity={0.35} roughness={0.1} transmission={0.4} />
      </mesh>
      <mesh ref={rightDoorRef} position={[0.9, 1.6, depth / 2]} castShadow>
        <boxGeometry args={[1.6, 3.2, 0.08]} />
        <meshPhysicalMaterial color={accent} transparent opacity={0.35} roughness={0.1} transmission={0.4} />
      </mesh>

      {/* Product pedestals inside the store */}
      {productPositions.map(({ product, offsetX }) => (
        <ProductObject
          key={product._id}
          product={product}
          position={[offsetX, 1.1, -depth / 2 + 1.5]}
          accentColor={accent}
          onSelect={onSelectProduct}
        />
      ))}
    </group>
  );
}
