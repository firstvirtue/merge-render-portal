import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { useCursor, MeshPortalMaterial, CameraControls, Gltf, Text, Sky, Cloud } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing, geometry } from 'maath'
import { suspend } from 'suspend-react'
import { Physics, Debug } from '@react-three/cannon';
import FBOParticles from './fboBox/FBOCanvas'
import FisheyeScene from './FisheyeScene'
// import Vehicle from './components/vehicle'

extend(geometry)
const regular = import('@pmndrs/assets/fonts/inter_regular.woff')
const medium = import('@pmndrs/assets/fonts/inter_medium.woff')

export const App = () => {
  return (
    <div style={{height: '90vh'}}>
    <Canvas id='freg' camera={{ fov: 70, position: [0, 0, 20] }} eventSource={document.getElementById('root')} eventPrefix="client">
      <color attach="background" args={['#f0f0f0']} />        
      <ambientLight intensity={0.1} />
      <directionalLight color="red" position={[0, 0, 5]} />
      <Sky />
      <group>
        <Gltf src="/assets/model/jeep.glb" scale={1} position={[0, 0, 0]} />
      </group>

      <Physics>
        {/* <Vehicle world={world} /> */}
      </Physics>
      
      <Rig />
    </Canvas>
    </div>
  )
}

function Rig({ position = new THREE.Vector3(0, 0, 2), focus = new THREE.Vector3(0, 0, 0) }) {
  const { controls, scene } = useThree()
  const [, params] = useRoute('/item/:id')
  useEffect(() => {
    controls?.setLookAt(...position.toArray(), ...focus.toArray(), true)
  })

  return <CameraControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
}
