// GalaxyCanvas.jsx
// Renders the full 3D galaxy view, placing all planet components in the scene.
// Includes a camera, lighting, and orbit controls.

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { GridHelper } from 'three'
import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import React, { useState } from 'react'
import Planet from './Planet'
import GridMapper from '../utils/gridMapper'

/**
 * An array of planet metadata used to generate each Planet component.
 * Each planet includes:
 * - name: The display name of the planet (not currently used in UI)
 * - position: [x, y, z] position in 3D space
 */

const rawPlanetData = [
  { name: 'Tatooine', position: [2, 2, 0], coord: 'R-16', offset: [-2, 1, 0]},
  { name: 'Naboo', position: [-2, -1, 0], coord: 'O-17', offset: [0, 5, 0]},
  { name: 'Coruscant', position: [1, -3, 1], coord: 'L-9', offsest: [1, 0, 0]}
]

/**
 * The grid layout configuration, used both for rendering the grid and mapping coordinates.
 */
const gridSize = 200
const divisions = 21

/**
 * Convert each planet's coord (e.g., "R-16") into a position vector using GridMapper.
 * Also spread the original data using ...p so we keep name/coord/etc.
 */
const planetData = rawPlanetData.map(p => {
  const basePos = GridMapper(p.coord, gridSize, divisions)
  const off = p.offset || [0, 0, 0]

  const position = [
    basePos[0] + off[0],
    basePos[1] + off[1],
    basePos[2] + off[2]
  ]

  return {
    ...p,
    position
  }
})

/**
 * Scene
 * Renders lighting and planets based on the `planetData` array.
 */

function Scene() {
    function Grid() {
        const grid = useMemo(
          () => new GridHelper(gridSize, divisions, '#3a9bdc', '#3a9bdc'), 
          []
        )
        grid.material.opacity = 0.15
        grid.material.transparent = true
        return <primitive object={grid} rotation={[Math.PI / 2, 0, 0]} /> //rotate to face upward (XY plane)
    }
    const [targetPosition, setTargetPosition] = useState(null)
    const { camera } = useThree((state) => ({ camera: state.camera }))
    const controlsRef = useRef()
    
    useFrame(() => {
      if (targetPosition) {
        camera.position.lerp(targetPosition, 0.05)
        controlsRef.current.update()
        
        if (camera.position.distanceTo(targetPosition) < 0.1) {
          camera.position.copy(targetPosition)
          setTargetPosition(null)
        }
      }
    })

    const handlePlanetClick = (name, position) => {
        console.log(`Clicked planet: ${name}`)
        const planetVec = new THREE.Vector3(...position)

        // Tell OrbitControls to look at the planet
        controlsRef.current.target.copy(planetVec)

        const offsetPos = planetVec.clone().add(new THREE.Vector3(10, 5, 10))
        setTargetPosition(offsetPos)
    }

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Grid />
      {planetData.map((planet, index) => (
        <Planet 
          key={index} 
          position={planet.position} 
          name={planet.name} 
          onClick={() => handlePlanetClick(planet.name, planet.position)} 
        />
      ))}

      <OrbitControls ref={controlsRef} />
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
    </Canvas>
  )
}

export default GalaxyCanvas
