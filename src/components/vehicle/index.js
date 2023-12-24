import React from 'react';
import { usePlane, useBox, useCylinder } from '@react-three/cannon';

const Vehicle = () => {
  const [ref, api] = useBox(() => ({ mass: 1, position: [0, 2, 0] }));
  const [wheel1Ref] = useCylinder(() => ({ mass: 0.5, args: [0.5, 0.5, 0.2], position: [1, 0.5, 1] }));
  const [wheel2Ref] = useCylinder(() => ({ mass: 0.5, args: [0.5, 0.5, 0.2], position: [-1, 0.5, 1] }));

  return (
    <>
      <mesh ref={ref} castShadow receiveShadow>
        <boxBufferGeometry args={[2, 1, 4]} />
        <meshStandardMaterial color="blue" />
      </mesh>

      <mesh ref={wheel1Ref} position={[1, 0.5, 1]} castShadow receiveShadow>
        <cylinderBufferGeometry args={[0.5, 0.5, 0.2, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>

      <mesh ref={wheel2Ref} position={[-1, 0.5, 1]} castShadow receiveShadow>
        <cylinderBufferGeometry args={[0.5, 0.5, 0.2, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </>
  );
};

export default Vehicle;
