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
import PlanetInfoPanel from './PlanetInfoPanel'
import planetData, { gridSize, divisions } from '../data/processedPlanetData'
import { useEffect } from 'react'

/**
 * Scene
 * Renders lighting and planets based on the `planetData` array.
 */

function Scene({ setSelectedPlanet, setShowInfoPanel, showInfoPanel }) {
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
    const fadeTimeout = useRef(null)

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

    const handlePlanetClick = (planet) => {
      console.log(`Clicked planet: ${planet.name}`);
      const planetVec = new THREE.Vector3(...planet.position);
      const offsetPos = planetVec.clone().add(new THREE.Vector3(-10, 5, 10));
      
      setShowInfoPanel(false);
      setSelectedPlanet(null);
      setTargetPosition(offsetPos);

      // Tell OrbitControls to look at the planet
      controlsRef.current.target.copy(planetVec.clone().add(new THREE.Vector3(2, 0, 0)))

      const checkCamera = setInterval(() => {
        if (camera.position.distanceTo(offsetPos) < 0.1) {
          clearInterval(checkCamera);

          setTimeout(() => {
            setSelectedPlanet(planet);
            setShowInfoPanel(true);
          }, 100);
        }
      }, 50);
    };

    useEffect(() => {
      return () => {
        if (fadeTimeout.current) {
          clearTimeout(fadeTimeout.current)
        }
      }
    }, [])

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
          onClick={() => handlePlanetClick(planet)} 
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
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const [showInfoPanel, setShowInfoPanel] = useState(false)

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ width: '100vw', height: '100vh', background: 'black' }}
      >
        <Scene 
          setSelectedPlanet={setSelectedPlanet}
          setShowInfoPanel={setShowInfoPanel}
          showInfoPanel={showInfoPanel}
        />
      </Canvas>

      <PlanetInfoPanel
          planet={selectedPlanet}
          visible={showInfoPanel}
          onClose={() => {
            setSelectedPlanet(null)
            setShowInfoPanel(false)
          }}
      />
    </>
  )
}

export default GalaxyCanvas
