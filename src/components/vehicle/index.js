import { useEffect, useRef } from 'react';
import { useCannon } from './useCannon';

const Vehicle = (props) => {
  const chassisRef = useRef();
  const wheel1Ref = useRef();
  const wheel2Ref = useRef();

  // Create a chassis body
  const { ref: chassisBody, bodyProps: chassisBodyProps } = useCannon({
    mass: 1500,
    type: 'Dynamic',
  });

  // Create wheel bodies
  const { ref: wheel1Body, bodyProps: wheel1BodyProps } = useCannon({
    mass: 50,
    type: 'Dynamic',
  });

  const { ref: wheel2Body, bodyProps: wheel2BodyProps } = useCannon({
    mass: 50,
    type: 'Dynamic',
  });

  // Set up the vehicle using Cannon.js
  useEffect(() => {
    const wheel1 = new window.CANNON.RaycastVehicle({ chassis: chassisBody });
    const wheel2 = new window.CANNON.RaycastVehicle({ chassis: chassisBody });

    const options = {
      radius: 0.5,
      directionLocal: [0, -1, 0],
      suspensionStiffness: 30,
      suspensionRestLength: 0.3,
      frictionSlip: 5,
      dampingRelaxation: 2.3,
      dampingCompression: 4.4,
      maxSuspensionForce: 100000,
      rollInfluence: 0.01,
      axleLocal: [-1, 0, 0],
      chassisConnectionPointLocal: [1, 1, 0],
      isFrontWheel: false,
    };

    wheel1.caster.setFromWorldPosition(wheel1Ref.current.position);
    wheel1.caster.direction = options.directionLocal;
    wheel1.caster.maxSuspensionTravel = options.suspensionRestLength;

    wheel1.position.set(1, 1, 0);
    wheel1.rotation.set(0, Math.PI, 0);

    wheel1BodyProps.position.copy(wheel1.position);
    wheel1BodyProps.rotation.copy(wheel1.rotation);

    wheel1BodyProps.position.x += options.chassisConnectionPointLocal[0];
    wheel1BodyProps.position.y += options.chassisConnectionPointLocal[1];
    wheel1BodyProps.position.z += options.chassisConnectionPointLocal[2];

    wheel1Body.current.collisionFilterGroup = 0; // turn off collisions
    wheel1Body.current.collisionFilterMask = 0; // turn off collisions

    wheel1.addWheel(options);

    wheel2.caster.setFromWorldPosition(wheel2Ref.current.position);
    wheel2.caster.direction = options.directionLocal;
    wheel2.caster.maxSuspensionTravel = options.suspensionRestLength;

    wheel2.position.set(-1, 1, 0);
    wheel2.rotation.set(0, Math.PI, 0);

    wheel2BodyProps.position.copy(wheel2.position);
    wheel2BodyProps.rotation.copy(wheel2.rotation);

    wheel2BodyProps.position.x += options.chassisConnectionPointLocal[0];
    wheel2BodyProps.position.y += options.chassisConnectionPointLocal[1];
    wheel2BodyProps.position.z += options.chassisConnectionPointLocal[2];

    wheel2Body.current.collisionFilterGroup = 0; // turn off collisions
    wheel2Body.current.collisionFilterMask = 0; // turn off collisions

    wheel2.addWheel(options);

    // Add wheels to the world
    props.world.add(wheel1);
    props.world.add(wheel2);

    return () => {
      props.world.remove(wheel1);
      props.world.remove(wheel2);
    };
  }, [chassisBody, wheel1Body, wheel2Body, props.world]);

  // Return the components
  return (
    <>
      <mesh ref={chassisRef} position={[0, 2, 0]} castShadow receiveShadow>
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

      <primitive ref={chassisBody} object={chassisRef.current} />
      <primitive ref={wheel1Body} object={wheel1Ref.current} />
      <primitive ref={wheel2Body} object={wheel2Ref.current} />
    </>
  );
};

export default Vehicle;
