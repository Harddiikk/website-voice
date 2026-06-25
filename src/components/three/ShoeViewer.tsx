"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  AdaptiveDpr,
  ContactShadows,
  Environment,
  Float,
  Html,
  Lightformer,
  OrbitControls,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";

type Colorway = { primary?: string; accent?: string; sole?: string };

function ProceduralShoe({ primary = "#e23744", accent = "#1b1b1f", sole = "#f5f5f0" }: Colorway) {
  const g = useRef<THREE.Group>(null!);
  useFrame((s) => {
    if (g.current) g.current.position.y = Math.sin(s.clock.elapsedTime * 1.2) * 0.04;
  });
  return (
    <group ref={g} rotation={[0, -0.5, 0]} scale={1.2}>
      {/* outsole */}
      <RoundedBox args={[3.2, 0.35, 1.25]} radius={0.17} smoothness={6} position={[0, -0.55, 0]}>
        <meshStandardMaterial color={sole} roughness={0.6} metalness={0.05} />
      </RoundedBox>
      {/* midsole */}
      <RoundedBox args={[3.0, 0.3, 1.15]} radius={0.15} smoothness={6} position={[0, -0.25, 0]}>
        <meshStandardMaterial color="#ffffff" roughness={0.35} />
      </RoundedBox>
      {/* upper body */}
      <RoundedBox args={[2.4, 0.85, 1.05]} radius={0.42} smoothness={8} position={[-0.1, 0.2, 0]}>
        <meshStandardMaterial color={primary} roughness={0.45} metalness={0.15} />
      </RoundedBox>
      {/* toe box */}
      <mesh position={[1.05, 0.05, 0]} scale={[0.95, 0.7, 0.62]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color={primary} roughness={0.45} metalness={0.15} />
      </mesh>
      {/* heel counter */}
      <mesh position={[-1.15, 0.25, 0]} scale={[0.7, 0.85, 0.6]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color={accent} roughness={0.4} metalness={0.2} />
      </mesh>
      {/* ankle collar */}
      <mesh position={[-0.75, 0.62, 0]} rotation={[Math.PI / 2, 0, 0.2]}>
        <torusGeometry args={[0.42, 0.14, 16, 40]} />
        <meshStandardMaterial color={accent} roughness={0.5} />
      </mesh>
      {/* tongue */}
      <RoundedBox args={[0.7, 0.5, 0.9]} radius={0.18} smoothness={5} position={[-0.35, 0.55, 0]} rotation={[0, 0, 0.35]}>
        <meshStandardMaterial color={accent} roughness={0.55} />
      </RoundedBox>
      {/* laces */}
      {[0.05, 0.3, 0.55].map((x, i) => (
        <mesh key={i} position={[x - 0.1, 0.55 - i * 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.045, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#fafafa" roughness={0.7} />
        </mesh>
      ))}
      {/* side accent stripes */}
      {[0.54, -0.54].map((z, i) => (
        <mesh key={i} position={[0, 0.1, z]} rotation={[0, 0, -0.25]}>
          <boxGeometry args={[1.6, 0.18, 0.06]} />
          <meshStandardMaterial color={accent} roughness={0.3} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

const Loader = () => (
  <Html center>
    <div style={{ color: "#1d1d1f", font: "500 13px system-ui", opacity: 0.7 }}>Loading viewer…</div>
  </Html>
);

export default function ShoeViewer({ colorway }: { colorway?: Colorway }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [4.5, 1.6, 5], fov: 35 }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#f5f5f7"]} />
      <Suspense fallback={<Loader />}>
        <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.4}>
          <ProceduralShoe {...colorway} />
        </Float>
        <ContactShadows position={[0, -0.95, 0]} opacity={0.6} scale={12} blur={2.6} far={3} />
        {/* Studio lighting composed from Lightformers — rendered on-GPU, NO external HDR fetched */}
        <Environment resolution={256}>
          <Lightformer intensity={2} position={[0, 4, -6]} scale={[10, 6, 1]} />
          <Lightformer intensity={1.4} position={[-5, 2, 2]} scale={[6, 6, 1]} color="#b6c8ff" />
          <Lightformer intensity={1.2} position={[5, 1, 3]} scale={[6, 6, 1]} color="#ffd9b6" />
        </Environment>
      </Suspense>
      <OrbitControls
        enablePan={false}
        autoRotate
        autoRotateSpeed={1.1}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.9}
        minDistance={4}
        maxDistance={9}
      />
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
