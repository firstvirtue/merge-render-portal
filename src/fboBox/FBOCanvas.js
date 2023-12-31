import { OrbitControls, useFBO } from "@react-three/drei";
import { Canvas, useFrame, extend, createPortal, useLoader } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import SimulationMaterial from './SimulationMaterial';
import { TextureLoader } from 'three/src/loaders/TextureLoader'

import vertexShader from './vertexShader';
import fragmentShader from './fragmentShader';

extend({ SimulationMaterial: SimulationMaterial });

const FBOParticles = () => {
  const size = 128;

  const points = useRef();
  const simulationMaterialRef = useRef();

  const texture = useLoader(TextureLoader, '/assets/img/screenshot-0.png')

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1)
  const positions = new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0])
  const uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]);

  const renderTarget = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    type: THREE.FloatType,
  });

  const particlesPosition = useMemo(() => {
    const length = size * size;

    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      let i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }

    return particles;
  }, [size]);

  const uniforms = useMemo(() => ({
    uPositions: { value: null, },
    tex: { value: texture },
  }), [])

  useFrame((state) => {
    const { gl, clock } = state;

    gl.setRenderTarget(renderTarget);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    points.current.material.uniforms.uPositions.value = renderTarget.texture;
    simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
  })

  return (
    <>
    {createPortal(
      <mesh>
        <simulationMaterial ref={simulationMaterialRef} args={[size]} />
        <bufferGeometry>
          <bufferAttribute
            attach={'attributes-position'}
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach={'attributes-uv'}
            count={uvs.length / 2}
            array={uvs}
            itemSize={2}
          />
        </bufferGeometry>
      </mesh>,
      scene
    )}

    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
        attach="attributes-position"
        count={particlesPosition.length / 3}
        array={particlesPosition}
        itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        fragmentShader={fragmentShader}
        vertexShader = {vertexShader}
        uniforms={uniforms}
        />
      </points>
    </>
  )
}

export default FBOParticles;