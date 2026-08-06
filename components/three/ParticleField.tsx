'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../ThemeProvider';

const VERT = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uPixelRatio;
  attribute float aScale;
  attribute float aSpeed;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    p.y += sin(uTime * aSpeed + p.x * 0.6) * 0.34;
    p.x += cos(uTime * aSpeed * 0.7 + p.z * 0.5) * 0.28;

    // mouse attraction / displacement, depth weighted
    float depth = (p.z + 6.0) / 12.0;
    vec2 m = uMouse * 3.4 * depth;
    vec2 d = m - p.xy;
    float dist = length(d);
    p.xy += normalize(d + 0.0001) * smoothstep(3.2, 0.0, dist) * 0.55;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * uPixelRatio * (46.0 / -mv.z);
    vAlpha = smoothstep(0.0, 1.0, depth) * 0.85;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3  uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, a * a * vAlpha * uOpacity);
  }
`;

function Dust({ count = 1400, isLight }: { count?: number; isLight: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const scale = new Float32Array(count);
    const speed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      scale[i] = 0.5 + Math.random() * 2.2;
      speed[i] = 0.15 + Math.random() * 0.55;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aScale', new THREE.BufferAttribute(scale, 1));
    g.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uPixelRatio: { value: 1 },
      uColor: { value: new THREE.Color('#9fd0ff') },
      uOpacity: { value: 1 },
    }),
    []
  );

  // Additive blending adds nothing on top of a light page, so the dust has to
  // switch to normal blending and darken to stay visible.
  uniforms.uColor.value.set(isLight ? '#5b7a9e' : '#9fd0ff');
  uniforms.uOpacity.value = isLight ? 0.26 : 1;

  const pointer = useRef(new THREE.Vector2());

  useFrame((state, delta) => {
    if (!mat.current) return;
    uniforms.uTime.value += delta;
    uniforms.uPixelRatio.value = Math.min(state.gl.getPixelRatio(), 2);
    pointer.current.set(
      state.pointer.x * viewport.width * 0.5,
      state.pointer.y * viewport.height * 0.5
    );
    uniforms.uMouse.value.lerp(pointer.current, 0.06);
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        // blending is baked into the program — remount rather than flip it live
        key={isLight ? 'light' : 'dark'}
        ref={mat}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthWrite={false}
        blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleField({ className = '' }: { className?: string }) {
  const { isLight } = useTheme();

  return (
    <div className={`pointer-events-none ${className}`}>
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 9], fov: 52 }}
        frameloop="always"
      >
        <Dust isLight={isLight} />
      </Canvas>
    </div>
  );
}
