'use client';

import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CITIES, ROUTES, type City } from '@/lib/cities';
import { useRenderGate } from '@/hooks/useRenderGate';

const RADIUS = 2;

function toVec(lat: number, lon: number, r = RADIUS) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

const ATMO_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const ATMO_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float fres = pow(1.0 - abs(dot(vNormal, vView)), uPower);
    gl_FragColor = vec4(uColor, fres * uIntensity);
  }
`;

function Arc({ from, to }: { from: THREE.Vector3; to: THREE.Vector3 }) {
  const dotRef = useRef<THREE.Mesh>(null);
  const offset = useRef(Math.random());

  const { line, curve } = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5);
    const lift = 1 + from.distanceTo(to) * 0.32;
    mid.normalize().multiplyScalar(RADIUS * lift);
    const c = new THREE.QuadraticBezierCurve3(from, mid, to);
    const pts = c.getPoints(72);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);

    const colors: number[] = [];
    for (let i = 0; i < pts.length; i++) {
      const t = i / (pts.length - 1);
      const a = Math.sin(t * Math.PI);
      colors.push(0.35 + a * 0.45, 0.68 + a * 0.3, 1.0);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const mat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return { line: new THREE.Line(geo, mat), curve: c };
  }, [from, to]);

  useFrame((_, delta) => {
    offset.current = (offset.current + delta * 0.13) % 1;
    if (dotRef.current) {
      const p = curve.getPoint(offset.current);
      dotRef.current.position.copy(p);
      const s = 0.4 + Math.sin(offset.current * Math.PI) * 0.9;
      dotRef.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      <primitive object={line} />
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshBasicMaterial color="#dff0ff" transparent opacity={0.95} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function Node({ city, onHover }: { city: City; onHover: (c: City | null) => void }) {
  const pos = useMemo(() => toVec(city.lat, city.lon, RADIUS * 1.005), [city]);
  const ring = useRef<THREE.Mesh>(null);
  const [hot, setHot] = useState(false);

  useFrame(({ clock }) => {
    if (!ring.current) return;
    const t = (clock.elapsedTime * 0.6 + city.lon) % 1.6;
    const s = 1 + t * 1.7;
    ring.current.scale.setScalar(s);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.55 - t * 0.36);
    ring.current.lookAt(0, 0, 0);
  });

  const color = `rgb(${city.accent})`;

  return (
    <group position={pos}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHot(true);
          onHover(city);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHot(false);
          onHover(null);
          document.body.style.cursor = '';
        }}
        scale={hot ? 1.9 : 1}
      >
        <sphereGeometry args={[0.045, 14, 14]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.05, 0.062, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.11, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={hot ? 0.34 : 0.14} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function Earth({ onHover }: { onHover: (c: City | null) => void }) {
  const group = useRef<THREE.Group>(null);
  const paused = useRef(false);

  const nodeMap = useMemo(() => {
    const m = new Map<string, THREE.Vector3>();
    CITIES.forEach((c) => m.set(c.name, toVec(c.lat, c.lon, RADIUS * 1.005)));
    return m;
  }, []);

  const grid = useMemo(() => {
    const g = new THREE.Group();
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#4da6ff'),
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    for (let lat = -75; lat <= 75; lat += 15) {
      const pts: THREE.Vector3[] = [];
      for (let lon = -180; lon <= 180; lon += 4) pts.push(toVec(lat, lon, RADIUS * 1.001));
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
    }
    for (let lon = -180; lon < 180; lon += 15) {
      const pts: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 4) pts.push(toVec(lat, lon, RADIUS * 1.001));
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
    }
    return g;
  }, []);

  const atmoUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color('#6fb6ff') },
      uPower: { value: 2.6 },
      uIntensity: { value: 1.0 },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    if (!paused.current) group.current.rotation.y += delta * 0.055;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -state.pointer.y * 0.22,
      0.04
    );
  });

  return (
    <group
      ref={group}
      onPointerOver={() => (paused.current = true)}
      onPointerOut={() => (paused.current = false)}
    >
      <mesh>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshBasicMaterial color="#04070f" />
      </mesh>

      <primitive object={grid} />

      <mesh scale={1.055}>
        <sphereGeometry args={[RADIUS, 48, 48]} />
        <shaderMaterial
          uniforms={atmoUniforms}
          vertexShader={ATMO_VERT}
          fragmentShader={ATMO_FRAG}
          transparent
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {ROUTES.map(([a, b], i) => {
        const from = nodeMap.get(a);
        const to = nodeMap.get(b);
        if (!from || !to) return null;
        return <Arc key={`${a}-${b}-${i}`} from={from} to={to} />;
      })}

      {CITIES.map((c) => (
        <Node key={c.name} city={c} onHover={onHover} />
      ))}
    </group>
  );
}

export default function Globe({ onHover }: { onHover: (c: City | null) => void }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const { active, still } = useRenderGate(hostRef);

  return (
    <div ref={hostRef} className="h-full w-full">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.6, 6.2], fov: 42 }}
        // Stops the globe spinning while it is scrolled past or the tab is hidden
        frameloop={still || !active ? 'demand' : 'always'}
      >
        <ambientLight intensity={0.6} />
        <Earth onHover={onHover} />
      </Canvas>
    </div>
  );
}
