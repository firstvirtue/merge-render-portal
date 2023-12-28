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

import { AppScene } from './components/scene/index.tsx'

export const App = () => {
  
  return (
    <div style={{height: '90vh'}}>
    <Canvas id='freg' camera={{ fov: 70, position: [0, 0, 20] }} eventSource={document.getElementById('root')} eventPrefix="client">
      
      <AppScene />
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
