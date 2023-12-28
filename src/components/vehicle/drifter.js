/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: Ivan Norman (https://sketchfab.com/vanidza)
license: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
source: https://sketchfab.com/3d-models/low-poly-truck-car-drifter-f3750246b6564607afbefc61cb1683b1
title: Low-poly truck (car "Drifter")
*/

import React, { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useBox } from '@react-three/cannon';
import { Gltf } from '@react-three/drei'

const Drifter = forwardRef(({ args = [0.5, 0.5, 1.4], mass = 500, setVisible, ...props }, ref) => {
  

  const [, api] = useBox(
    () => ({
      mass,
      args,
      allowSleep: false,
      onCollide: (e) => {
        // Temporarily removing health system
        // const health = e.body.userData.health ?? undefined;
        // if (health) {
        //   e.body.userData.health += -10;
        //   return;
        // }
        // if (e.body.userData.health === 0) {
        //   console.log(e.body.visible, 'Murderrrrr');
        //   e.body.visible = false;
        //   return;
        // }
      },
      ...props
    }),
    ref
  );

  return (
    <mesh ref={ref} api={api} userData={{ id: 'drifter' }} {...props}>
      <group position={[0, 0, 0]} dispose={null}>
        <group rotation={[0, 0, 0]}>
          <group rotation={[0, 0, 0]}>
            <group name="Frame" rotation={[0, 0, 0]}>
            <Gltf src="/assets/model/jeep.glb" position={[0, -0.2, -0.14]} scale={[1, 1, 1.4]}/>
            </group>
          </group>
        </group>
      </group>
    </mesh>
  );
});

export default Drifter;