import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { usePlane, useBox, useCylinder, useRaycastVehicle } from '@react-three/cannon';
import { Gltf } from '@react-three/drei'
import { useControls } from './utils/useControls';
import Wheel from './wheel';
import Drifter from './drifter';
import useFollowCam from './utils/useFollowCam'

const Vehicle = ({ radius = 0.2, width = 0.3, height = 0, front = 0.38, back = -0.35, steer = 0.6, force = 4000, maxBrake = 1e5, ...props }) => {
  const [planeRef] = usePlane(() => ({ mass: 0, position: [0, -1, 0], rotation: [Math.PI / -2, 0, 0]}))

  const chassis = useRef();
  const wheel1 = useRef();
  const wheel2 = useRef();
  const wheel3 = useRef();
  const wheel4 = useRef();
  const controls = useControls();

  const wheelInfo = {
    radius,
    directionLocal: [0, -1, 0],
    suspensionStiffness: 30,
    suspensionRestLength: 0.3,
    maxSuspensionForce: 1e4,
    maxSuspensionTravel: 0.3,
    dampingRelaxation: 10,
    dampingCompression: 4.4,
    axleLocal: [-1, 0, 0],
    chassisConnectionPointLocal: [1, 0, 1],
    useCustomSlidingRotationalSpeed: true,
    customSlidingRotationalSpeed: -30,
    frictionSlip: 2
  };

  const wheelInfo1 = { ...wheelInfo, isFrontWheel: true, chassisConnectionPointLocal: [-width / 1.5, height, front] };
  const wheelInfo2 = { ...wheelInfo, isFrontWheel: true, chassisConnectionPointLocal: [width / 1.5, height, front] };
  const wheelInfo3 = { ...wheelInfo, isFrontWheel: false, chassisConnectionPointLocal: [-width / 1.5, height, back] };
  const wheelInfo4 = { ...wheelInfo, isFrontWheel: false, chassisConnectionPointLocal: [width / 1.5, height, back] };

  const [vehicle, api] = useRaycastVehicle(() => ({
    chassisBody: chassis,
    wheels: [wheel1, wheel2, wheel3, wheel4],
    wheelInfos: [wheelInfo1, wheelInfo2, wheelInfo3, wheelInfo4],
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1
  }));

  // const { yaw } = useFollowCam(chassis, [0, 3, 0.5])

  const resetCar = () => {
    chassis.current.api.position.set(0, 0.5, 0);
    chassis.current.api.velocity.set(0, 0, 0);
    chassis.current.api.angularVelocity.set(0, 0.5, 0);
    chassis.current.api.rotation.set(0, -Math.PI / 4, 0);
  };

  useFrame(() => {
    const { forward, backward, left, right, brake, reset } = controls.current;
    for (let e = 2; e < 4; e++) api.applyEngineForce(forward || backward ? force * (forward && !backward ? -1 : 1) : 0, 2);

    for (let s = 0; s < 2; s++) api.setSteeringValue(left || right ? steer * (left && !right ? 1 : -1) : 0, s);

    for (let b = 2; b < 4; b++) api.setBrake(brake ? maxBrake : 0, b);

    if (reset) {
      console.log(1)
      resetCar();
      return;
    }
  });

  return (
    <>
      <group ref={vehicle} position={[0, 0, 0]}>
        <Drifter ref={chassis} rotation={props.rotation} position={props.position} angularVelocity={props.angularVelocity} />
        <Wheel ref={wheel1} radius={radius} leftSide />
        <Wheel ref={wheel2} radius={radius} />
        <Wheel ref={wheel3} radius={radius} leftSide />
        <Wheel ref={wheel4} radius={radius} />
      </group>
    </>
  );
};

export default Vehicle;
