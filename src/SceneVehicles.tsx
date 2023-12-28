import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { useCursor, MeshPortalMaterial, CameraControls, useGLTF, Gltf, Text, Sky, Cloud } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing, geometry } from 'maath'
import { suspend } from 'suspend-react'
import type { TrimeshProps } from '@react-three/cannon';
import { Physics, Debug, useCylinder, useTrimesh } from '@react-three/cannon';
import FBOParticles from './fboBox/FBOCanvas'
import FisheyeScene from './FisheyeScene'
import Vehicle from './components/vehicle'

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

const Terrain = ({ position }: Pick<TrimeshProps, 'position'>) => {
  const { scene } = useGLTF('/assets/model/terrain.003.glb')
  console.log('scene:: ', scene)

  // const {
  //   nodes: {
  //     terrain003: { geometry },
  //   },
  // } = useGLTF('/assets/model/terrain.003.glb') as TerrainGLTF


  const {
    attributes: {
      position: { array: vertices },
    },
    index: { array: indices },
  } = scene.children[0].geometry

  // const [hovered, setHover] = useState(false)
  // const { isPaused } = useStore()

  const [ref] = useTrimesh(
    () => ({
      args: [vertices, indices],
      mass: 0,
      position
    }),
    useRef<Mesh>(null),
  )

  return (

    // <mesh
    //   ref={ref}
    //   geometry={geometry}
    // >
    //   <meshStandardMaterial color={'white'} />
    // </mesh>

    <primitive
      ref={ref}
      object={scene}
    >
      {/* <meshStandardMaterial color={'green'} /> */}
    </primitive>
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

export const App = () => {
  
  return (
    <div style={{height: '90vh'}}>
    <Canvas id='freg' camera={{ fov: 70, position: [0, 0, 20] }} eventSource={document.getElementById('root')} eventPrefix="client">
      <color attach="background" args={['#f0f0f0']} />        
      <ambientLight intensity={0.5} />
      <directionalLight color="white" position={[0, 0, 5]} />
      <Sky />

      <Physics>
        <Debug>
          <Box position={[-11, 1, 12]} userData={{ id: 'box-1', health: 80 }}/>
          <Terrain position={[-6, 0, 13]} />
          <group position={[0, -1, 50]}>
            {/* <Gltf src="/assets/model/terrain.003.glb" scale={1} position={[0, 0, 0]} /> */}
            <Gltf src="/assets/model/terrain.004.glb" scale={1} position={[0, 0, 0]} />
            <Gltf src="/assets/model/terrain.002.glb" scale={1} position={[0, 0, 0]} />
            {/* <Gltf src="/assets/model/eiffel.glb" scale={1} position={[0, 0, 0]} /> */}
            <Gltf src="/assets/model/europe.glb" scale={1} position={[0, 0, 0]} />
          </group>
        <Vehicle position={[0, 2, 0]} rotation={[0, -Math.PI / 4, 0]} angularVelocity={[0, 1, 0]} wheelRadius={2} />
        </Debug>
      </Physics>
      
      <Rig />
    </Canvas>
    </div>
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
