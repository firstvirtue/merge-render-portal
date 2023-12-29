import * as THREE from 'three'
import { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { useCursor, MeshPortalMaterial, CameraControls, useGLTF, Gltf, Text, Sky, Cloud } from '@react-three/drei'
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
      ref={ref}
      geometry={geometry}
    >
      <meshStandardMaterial color={'white'} />
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

const Box = (props) => {
  const [ref] = useCylinder(() => ({ mass: 0.3, args: [1, 1, 2, 16], ...props }));

  return (
    <mesh ref={ref}>
      <Gltf src="/assets/model/eiffel.glb" scale={1} position={[0, -1, 0]} />
    </mesh>
  );
};

export const AppScene = () => {

  console.log('Box:: ', Box)
  
  return (
    <>
      <color attach="background" args={['#f0f0f0']} />        
      <ambientLight intensity={0.5} />
      <directionalLight color="white" position={[0, 0, 5]} />
      <Sky />

      <Physics>
        <Debug>
          <group>
          <Box position={[-11, 1, 12]} userData={{ id: 'box-1', health: 80 }}/>
          </group>
          <Terrain position={[-6, -1, 13]} />
          
          <group position={[0, -1, 50]}>
            <Gltf src="/assets/model/terrain.004.glb" scale={1} position={[0, 0, 0]} />
            <Gltf src="/assets/model/terrain.002.glb" scale={1} position={[0, 0, 0]} />
            {/* <Gltf src="/assets/model/eiffel.glb" scale={1} position={[0, 0, 0]} /> */}
            <Gltf src="/assets/model/europe.glb" scale={1} position={[0, 0, 0]} />
          </group>
        <Vehicle position={[0, 2, 0]} rotation={[0, -Math.PI / 4, 0]} angularVelocity={[0, 1, 0]} wheelRadius={2} />
        </Debug>
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
