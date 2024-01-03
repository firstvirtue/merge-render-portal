import * as THREE from 'three'
import { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { Box, Plane, useCursor, MeshPortalMaterial, CameraControls, useGLTF, Gltf, Text, Sky, Cloud } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing, geometry } from 'maath'
import { suspend } from 'suspend-react'
import type { TrimeshProps } from '@react-three/cannon';
import { Physics, Debug, useCylinder, useTrimesh, useConvexPolyhedron } from '@react-three/cannon';
import { Geometry } from "three-stdlib";
import Vehicle from '../vehicle'

// extend(geometry)
const regular = import('@pmndrs/assets/fonts/inter_regular.woff')
const medium = import('@pmndrs/assets/fonts/inter_medium.woff')

type TerrainGLTF = GLTF & {
  materials: {}
  nodes: {
    terrain003: Mesh & {
      geometry: BufferGeometry & { index: ArrayLike<number> }
    }
  }
}

// type Store = {
//   isPaused: boolean
//   pause: () => void
//   play: () => void
// }

// const useStore = create<Store>((set) => ({
//   isPaused: false,
//   pause: () => set({ isPaused: true }),
//   play: () => set({ isPaused: false }),
// }))

function toConvexProps(bufferGeometry) {
  const geo = new Geometry().fromBufferGeometry(bufferGeometry);
  // Merge duplicate vertices resulting from glTF export.
  // Cannon assumes contiguous, closed meshes to work
  geo.mergeVertices();
  return [geo.vertices.map((v) => [v.x, v.y, v.z]), geo.faces.map((f) => [f.a, f.b, f.c]), []]; // prettier-ignore
}

const Terrain = ({ position }: Pick<TrimeshProps, 'position'>) => {
  // const { scene } = useGLTF('/assets/model/terrain.002.glb')
  // console.log('scene:: ', scene)

  const {
    nodes: {
      MtFuji_low: { geometry },
    },
  } = useGLTF('/assets/model/Fuji.glb') as TerrainGLTF

  // const { nodes } = useGLTF("/assets/model/Fuji.glb");

  
  const {
    attributes: {
      position: { array: vertices },
    },
    index: { array: indices },
  } = geometry


  const [ref] = useTrimesh(
    () => ({
      args: [vertices, indices],
      mass: 0,
      position
    }),
    useRef<Mesh>(null),
  )

  // const [hovered, setHover] = useState(false)
  // const { isPaused } = useStore()

  // const geo = useMemo(() => toConvexProps(nodes.MtFuji_low.geometry), [nodes]);
  // const [ref] = useConvexPolyhedron(() => ({ mass: 100, ...props, args: geo }));

  return (

    <mesh
      receiveShadow
      ref={ref}
      geometry={geometry}
    >
      <meshStandardMaterial color={'green'} />
    </mesh>

    // <primitive
    //   ref={ref}
    //   object={nodes}
    // >
    //   <meshStandardMaterial color={'green'} />
    // </primitive>
  )
}

const Bowl = ({ rotation }: Pick<TrimeshProps, 'rotation'>) => {
  const {
    nodes: {
      'bowl': { geometry },
    },
  } = useGLTF('/assets/model/bowl.glb') as BowlGLTF
  const {
    attributes: {
      position: { array: vertices },
    },
    index: { array: indices },
  } = geometry

  

  const [ref] = useTrimesh(
    () => ({
      args: [vertices, indices],
      mass: 0,
      rotation,
    }),
    useRef<Mesh>(null),
  )

  return (
    <mesh
      ref={ref}
      geometry={geometry}
    >
      <meshStandardMaterial color={'white'} />
    </mesh>
  )
}

const Obje = (props) => {
  const [ref] = useCylinder(() => ({ mass: 0.3, args: [1, 1, 2, 16], ...props }));

  return (
    <mesh ref={ref}>
      <Gltf castShadow src={props.src} scale={1} position={[0, -1, 0]} />
    </mesh>
  );
};

export const AppScene = () => {

  const boxRef = useRef<Mesh>(null);
  useFrame(() => {
    boxRef.current.rotation.y += 0.004;
    boxRef.current.rotation.x += 0.004;
    boxRef.current.rotation.z += 0.004;
  });

  console.log('Scene:: ')
  
  return (
    <>
      <color attach="background" args={['#f0f0f0']} />        
      <ambientLight intensity={0.5} />
      <directionalLight color="white" position={[0, 22, 15]} 
      intensity={0.5}
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-camera-far={50}
      shadow-camera-left = {-20}
      shadow-camera-right = {20}
      shadow-camera-top = {20}
      shadow-camera-bottom = {-20}
      />
      <Sky />

      <Physics>
      <Box ref={boxRef} castShadow position={[0, 0.5, 0]}></Box>
        {/* <Debug> */}
          <group>
          <Obje src={"/assets/model/eiffel.glb"} position={[-11, 1, 12]} userData={{ id: 'box-1', health: 80 }}/>
          <Obje src={"/assets/model/colosseum.glb"} position={[-3, 1, 15]} userData={{ id: 'box-2', health: 80 }}/>
          <Obje src={"/assets/model/pisa.glb"} position={[-2.5, 1, 17]} userData={{ id: 'box-3', health: 80 }}/>
          </group>
          <Terrain position={[16, -1, 13]} />
          
          <group position={[0, -1, 50]}>
            <Gltf src="/assets/model/terrain.004.glb" scale={1} position={[0, 0, 0]} />
            <Gltf src="/assets/model/terrain.002.glb" scale={1} position={[0, 0, 0]} />
            <Gltf receiveShadow src="/assets/model/europe.glb" scale={1} position={[0, 0, 0]} />
          </group>
        <Vehicle position={[0, 2, 0]} rotation={[0, -Math.PI / 4, 0]} angularVelocity={[0, 1, 0]} wheelRadius={2} />
        {/* </Debug> */}
      </Physics>
      
      {/* <Rig /> */}
    </>
  )
}

function Rig({ position = new THREE.Vector3(0, 3, 10), focus = new THREE.Vector3(0, 0, 0) }) {
  const { controls, scene } = useThree()
  const [, params] = useRoute('/item/:id')
  useEffect(() => {
    controls?.setLookAt(...position.toArray(), ...focus.toArray(), true)
  })

  return <CameraControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
}
