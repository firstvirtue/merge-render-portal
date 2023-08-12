import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, extend, useFrame, useThree, createPortal } from '@react-three/fiber'
import { useCursor, MeshPortalMaterial, CameraControls, Gltf, Text } from '@react-three/drei'
import { useFBO, useGLTF, useScroll, Image, Scroll, Preload, ScrollControls, MeshTransmissionMaterial } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing, geometry } from 'maath'
import { suspend } from 'suspend-react'

extend(geometry)
const regular = import('@pmndrs/assets/fonts/inter_regular.woff')
const medium = import('@pmndrs/assets/fonts/inter_medium.woff')

let isZoomChangable = true

export const App = () => (
  <Canvas camera={{ fov: 75, position: [0, 0, 2], focus: [0, 0, 0] }}>
    <ScrollControls damping={0.2} pages={3} distance={0.5}>
    <color attach="background" args={['#f0f0f0']} />
    {/* <Lens> */}
      {/* <Scroll> */}
        {/* <Typography /> */}
        {/* <Images /> */}
        <Frames />
      {/* </Scroll> */}
      <Scroll html>
        <div style={{ transform: 'translate3d(65vw, 200vh, 0)' }}>
          PMNDRS Pendant lamp
          <br />
          bronze, 38 cm
          <br />
          CHF 59.95
          <br />
        </div>
      </Scroll>
        
      {/* TODOS.. */}
    {/* </Lens> */}
    </ScrollControls>
  </Canvas>
)

function Frames() {
  const group = useRef()
  const scroll = useScroll()
  const viewport = useThree((state) => state.viewport)

  useFrame(() => {
    // console.log(scroll.offset)
    // [TODO] merge dimension
    group.current.position.y = scroll.offset * 3
  })

  return (
    <group ref={group}>
        <Frame id="01" name={`pick\nles`} author="Omar Faruq Tawsif" bg="#e4cdac" position={[-1.15, 0, 0]} rotation={[0, 0.5, 0]}>
          {/* <Gltf src="pickles_3d_version_of_hyuna_lees_illustration-transformed.glb" scale={8} position={[0, -0.7, -2]} /> */}
        </Frame>
        <Frame id="02" name="tea" author="Omar Faruq Tawsif">
          {/* <Gltf src="fiesta_tea-transformed.glb" position={[0, -2, -3]} /> */}
        </Frame>
        <Frame id="03" name="still" author="Omar Faruq Tawsif" bg="#d1d1ca" position={[1.15, 0, 0]} rotation={[0, -0.5, 0]}>
          {/* <Gltf src="still_life_based_on_heathers_artwork-transformed.glb" scale={2} position={[0, -0.8, -4]} /> */}
        </Frame>

        <Rig />
    </group>
  )
}

function Images() {
  const group = useRef()
  const data = useScroll()
  const { width, height } = useThree((state) => state.viewport)
  useFrame(() => {
    group.current.children[0].material.zoom = 1 + data.range(0, 1 / 3) / 3
    group.current.children[1].material.zoom = 1 + data.range(0, 1 / 3) / 3
    group.current.children[2].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2
    group.current.children[3].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2
    group.current.children[4].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2
    group.current.children[5].material.grayscale = 1 - data.range(1.6 / 3, 1 / 3)
    group.current.children[6].material.zoom = 1 + (1 - data.range(2 / 3, 1 / 3)) / 3
  })
  return (
    <group ref={group}>
      <Image position={[-2, 0, 0]} scale={[4, height, 1]} url="/img1.jpg" />
      <Image position={[2, 0, 3]} scale={3} url="/img6.jpg" />
      <Image position={[-2.05, -height, 6]} scale={[1, 3, 1]} url="/trip2.jpg" />
      <Image position={[-0.6, -height, 9]} scale={[1, 2, 1]} url="/img8.jpg" />
      <Image position={[0.75, -height, 10.5]} scale={1.5} url="/trip4.jpg" />
      <Image position={[0, -height * 1.5, 7.5]} scale={[1.5, 3, 1]} url="/img3.jpg" />
      <Image position={[0, -height * 2 - height / 4, 0]} scale={[width, height / 1.1, 1]} url="/img7.jpg" />
    </group>
  )
}

function Typography() {
  const state = useThree()
  const { width, height } = state.viewport.getCurrentViewport(state.camera, [0, 0, 12])
  const shared = { font: '/Inter-Regular.woff', letterSpacing: -0.1, color: 'black' }
  return (
    <>
      <Text children="to" anchorX="left" position={[-width / 2.5, -height / 10, 12]} {...shared} />
      <Text children="be" anchorX="right" position={[width / 2.5, -height * 2, 12]} {...shared} />
      <Text children="home" position={[0, -height * 4.624, 12]} {...shared} />
    </>
  )
}

function Frame({ id, name, author, bg, width = 1, height = 1.61803398875, children, ...props }) {
  const portal = useRef()
  const [, setLocation] = useLocation()
  const [, params] = useRoute('/item/:id')
  const [hovered, hover] = useState(false)
  useCursor(hovered)
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
      <mesh name={id} onClick={(e) => (e.stopPropagation(), setLocation('/item/' + e.object.name))} onPointerOver={(e) => hover(true)} onPointerOut={() => hover(false)}>
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
  const { controls, scene, camera } = useThree()
  const [, params] = useRoute('/item/:id')
  const viewport = useThree((state) => state.viewport)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // console.log('viewport:: ', viewport)
  }, [viewport])

  useEffect(() => {
    const active = scene.getObjectByName(params?.id)
    if (active) {
      active.parent.localToWorld(position.set(0, 0.5, 0.25))
      active.parent.localToWorld(focus.set(0, 0, -2))
      // position.set(0, 0.5, 0.25)
      // focus.set(0, 0, -2)
      isZoomChangable = true
      setEnabled(true)
    } else {
      isZoomChangable = false
      setTimeout(() => {
        setEnabled(false)
        // console.log(viewport.getCurrentViewport())
      }, 1000)
    }
    controls?.setLookAt(...position.toArray(), ...focus.toArray(), true)
  })

  return <CameraControls enabled={enabled} makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} 
  onChange={(e) => {
    // console.log(e)
    // console.log('viewport::', viewport, viewport.getCurrentViewport())
  }}
  />
}

function Lens({ children, damping = 0.15, ...props }) {
  const ref = useRef()
  // const { nodes } = useGLTF('/lens-transformed.glb')
  const buffer = useFBO()
  const viewport = useThree((state) => state.viewport)
  const [curViewport, setCurViewport] = useState(viewport)
  const [scene] = useState(() => new THREE.Scene())
  useFrame((state, delta) => {
    // Tie lens to the pointer
    // getCurrentViewport gives us the width & height that would fill the screen in threejs units
    // By giving it a target coordinate we can offset these bounds, for instance width/height for a plane that
    // sits 15 units from 0/0/0 towards the camera (which is where the lens is)
    const viewport = state.viewport.getCurrentViewport(state.camera, [0, 0, 0])
    easing.damp3(
      ref.current.position,
      [(state.pointer.x * viewport.width) / 2, (state.pointer.y * viewport.height) / 2, 0],
      damping,
      delta
    )
    // This is entirely optional but spares us one extra render of the scene
    // The createPortal below will mount the children of <Lens> into the new THREE.Scene above
    // The following code will render that scene into a buffer, whose texture will then be fed into
    // a plane spanning the full screen and the lens transmission material
    state.gl.setRenderTarget(buffer)
    state.gl.setClearColor('#d8d7d7')
    state.gl.render(scene, state.camera)
    state.gl.setRenderTarget(null)
  })
  
  useEffect(() => {
    console.log('lens viewport:: ', viewport, isZoomChangable)
 
    // [TODO] viewport.getCurrentViewport()
    if(isZoomChangable) { 
      setCurViewport(viewport)
    }

  }, [viewport])
  return (
    <>
      {createPortal(children, scene)}
      <mesh scale={[curViewport.width, curViewport.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} />
      </mesh>
      <mesh scale={0.25} ref={ref} rotation-x={Math.PI / 2} {...props}>
        <sphereBufferGeometry args={[1, 30, 30]} />
        <MeshTransmissionMaterial buffer={buffer.texture} ior={1.2} thickness={1.5} anisotropy={0.1} chromaticAberration={0.04} />
      </mesh>
    </>
  )
}
