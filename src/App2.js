import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { useCursor, MeshPortalMaterial, CameraControls, Gltf, Text, Sky, Cloud } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing, geometry } from 'maath'
import { suspend } from 'suspend-react'
import FBOParticles from './fboBox/FBOCanvas'
import FisheyeScene from './FisheyeScene'
import { AppScene } from './components/scene/index.tsx'

extend(geometry)
const regular = import('@pmndrs/assets/fonts/inter_regular.woff')
const medium = import('@pmndrs/assets/fonts/inter_medium.woff')

export const App = () => {
  return (
    <div>
      <div style={{height: '100vh'}}>
        {/* <Canvas 
          colorManagement
          shadows // highlight-lines
          camera={{ fov: 70, position: [0, 0, 20] }} eventSource={document.getElementById('root')} eventPrefix="client">
          <color attach="background" args={['#f0f0f0']} />
          <Frame id="01" name={`pick\nles`} author="Omar Faruq Tawsif" bg="#e4cdac" position={[-1.15, 0, 0]} rotation={[0, 0, 0]}>
            <group>
              <Sky />
              <FBOParticles />
              <FisheyeScene />
              <Gltf src="pickles_3d_version_of_hyuna_lees_illustration-transformed.glb" scale={8} position={[0, -0.7, -2]} />
            </group>
          </Frame>
          <Frame id="02" name={`Hello\nWorld`} author="seoeunggyo5" position={[1, 0, 0]}>
            <AppScene />
          </Frame>
          <Rig />
        </Canvas> */}
      </div>

      <p className='slogan'>
        Hello world <br/>
        No Code No Life <br/>
        Generative AI <br/>Change the World!
      </p>
    </div>
  )
}

function Frame({ id, name, author, bg, width = 1.5, height = 1.61803398875, children, ...props }) {
  const portal = useRef()
  const [, setLocation] = useLocation()
  const [, params] = useRoute('/item/:id')
  const [hovered, hover] = useState(false)
  // useCursor(hovered)
  useFrame((state, dt) => easing.damp(portal.current, 'blend', params?.id === id ? 1 : 0, 0.2, dt))
  return (
    <group {...props}>
      <Text font={suspend(medium).default} fontSize={0.3} anchorY="top" anchorX="left" lineHeight={0.8} position={[-0.375, 0.715, 0.01]} material-toneMapped={false}>
        {name}
      </Text>
      <Text font={suspend(regular).default} fontSize={0.1} anchorX="right" position={[0.4, -0.659, 0.01]} material-toneMapped={false}>
        /{id}
      </Text>
      <Text font={suspend(regular).default} fontSize={0.04} anchorX="right" position={[0.0, -0.677, 0.01]} material-toneMapped={false}>
        {author}
      </Text>
      <mesh name={id} onClick={(e) => (e.stopPropagation(), setLocation('/item/' + e.object.name))} 
      // onPointerOver={(e) => hover(true)} onPointerOut={() => hover(false)}
      >
        <roundedPlaneGeometry args={[width, height, 0.1]} />
        <MeshPortalMaterial ref={portal} events={params?.id === id} side={THREE.DoubleSide}>
          <color attach="background" args={[bg]} />
          {children}
        </MeshPortalMaterial>
      </mesh>
    </group>
  )
}

function Rig({ position = new THREE.Vector3(0, 0, 2), focus = new THREE.Vector3(0, 0, 0) }) {
  const { controls, scene } = useThree()
  const [, params] = useRoute('/item/:id')
  useEffect(() => {
    const active = scene.getObjectByName(params?.id)
    if (active) {
      active.parent.localToWorld(position.set(0, 0.5, 0.25))
      active.parent.localToWorld(focus.set(0, 0, -2))
    }
    controls?.setLookAt(...position.toArray(), ...focus.toArray(), true)

    console.log('CameraControls:: ', controls)
    controls && (controls.mouseButtons.wheel = 0)
  })

  return <CameraControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
}
