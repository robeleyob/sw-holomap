// GalaxyCanvas.jsx
// Renders the full 3D galaxy view, placing all planet components in the scene.
// Includes a camera, lighting, and orbit controls.

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import React from 'react'
import Planet from './Planet'

/**
 * An array of planet metadata used to generate each Planet component.
 * Each planet includes:
 * - name: The display name of the planet (not currently used in UI)
 * - position: [x, y, z] position in 3D space
 */

const planetData = [
  { name: 'Tatooine', position: [2, 2, 0]},
  { name: 'Naboo', position: [-2, -1, 0]},
  { name: 'Coruscant', position: [1, -3, 1]}
]

/**
 * Scene
 * Renders lighting and planets based on the `planetData` array.
 */

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      {planetData.map((planet, index) => (
        <Planet key={index} position={planet.position} />
      ))}
    </>
  )
}

/**
 * GalaxyCanvas
 * The top-level component for rendering the 3D scene using React Three Fiber.
 * Inlcudes the camera, scene, and user controls.
 */

function GalaxyCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      style={{ width: '100vw', height: '100vh', background: 'black' }}
    >
      <Scene />
      <OrbitControls />
    </Canvas>
  )
}

export default GalaxyCanvas
