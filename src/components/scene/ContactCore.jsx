import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function useReducedContactScene() {
  const [settings, setSettings] = useState({ reduced: true, mobile: true });

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 820px)');

    const update = () => {
      setSettings({
        reduced: motionQuery.matches,
        mobile: mobileQuery.matches,
      });
    };

    update();
    motionQuery.addEventListener('change', update);
    mobileQuery.addEventListener('change', update);

    return () => {
      motionQuery.removeEventListener('change', update);
      mobileQuery.removeEventListener('change', update);
    };
  }, []);

  return settings;
}

function useGlobalPointer() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return pointer;
}

function HolographicCore({ reduced }) {
  const groupRef = useRef();
  const innerRef = useRef();
  const pointerRef = useGlobalPointer();

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const group = groupRef.current;
    const inner = innerRef.current;

    if (reduced) {
      group.rotation.y = elapsed * 0.12;
      return;
    }

    const pointer = pointerRef.current;
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, 0.24 - pointer.y * 0.14, 0.05);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, -0.5 + pointer.x * 0.24 + elapsed * 0.1, 0.05);
    group.position.x = THREE.MathUtils.lerp(group.position.x, pointer.x * 0.7, 0.04);
    group.position.y = THREE.MathUtils.lerp(group.position.y, pointer.y * 0.5, 0.04);

    inner.scale.setScalar(1 + Math.sin(elapsed * 1.6) * 0.06);
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[0.92, 1]} />
        <meshStandardMaterial
          color="#00f0ff"
          wireframe
          transparent
          opacity={0.4}
          emissive="#00f0ff"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[0.6, 0.4, 0]}>
        <torusGeometry args={[1.25, 0.012, 8, 64]} />
        <meshStandardMaterial color="#00f0ff" transparent opacity={0.5} emissive="#00f0ff" emissiveIntensity={0.6} />
      </mesh>
      <mesh rotation={[-0.7, 0.2, 0.6]}>
        <torusGeometry args={[1.45, 0.008, 8, 64]} />
        <meshStandardMaterial color="#a855f7" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function CoreParticles({ count = 72 }) {
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let index = 0; index < data.length; index += 3) {
      data[index] = (Math.random() - 0.5) * 6;
      data[index + 1] = (Math.random() - 0.5) * 4.4;
      data[index + 2] = (Math.random() - 0.5) * 3;
    }
    return data;
  }, [count]);

  return (
    <Points positions={positions} stride={3}>
      <PointMaterial color="#00f0ff" size={0.024} transparent opacity={0.5} depthWrite={false} />
    </Points>
  );
}

function ContactScene({ reduced, mobile }) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 4]} intensity={1.2} color="#e0f2fe" />
      <pointLight position={[-2, 1, 2]} color="#00f0ff" intensity={2} />
      <Float speed={reduced ? 0 : 0.9} rotationIntensity={reduced ? 0 : 0.12} floatIntensity={reduced ? 0 : 0.2}>
        <HolographicCore reduced={reduced} />
      </Float>
      <CoreParticles count={reduced ? 18 : mobile ? 28 : 72} />
    </>
  );
}

export function ContactCore() {
  const { reduced, mobile } = useReducedContactScene();

  return (
    <div className="contact-orbit" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 40 }}
        dpr={[1, mobile ? 1.2 : 1.6]}
        gl={{ antialias: !mobile, alpha: true, powerPreference: 'low-power' }}
      >
        <Suspense fallback={null}>
          <ContactScene reduced={reduced} mobile={mobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
