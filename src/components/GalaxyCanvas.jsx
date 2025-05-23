import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import React from 'react';

function Planet({ position=[0,0,0], color="blue" }) {
    return (
        <>
            {/* Inner glowing planet */}
            <mesh position={position}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={1.5}
                    toneMapped={false}
                />
            </mesh>

            {/* Outer holographic wireframe */}
            <mesh position={position}>
                <sphereGeometry args={[1.05, 32, 32]} />
                <meshBasicMaterial
                    color="cyan"
                    wireframe={true}
                    transparent={true}
                    opacity={0.3}
                />
            </mesh>
        </>
    );
}

function Scene() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Planet position={[0, 0, 0]} color='blue' />    
        </>
    );
}

function App() {
    return (
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }} style={{ width: '100vw', height: '100vh', background: 'black'}}>
            <Scene /> 
            <OrbitControls />
        </Canvas>
    );
}

export default App;