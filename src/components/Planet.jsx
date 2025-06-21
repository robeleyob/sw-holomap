// Planet.jsx
// Component that renders a single 3D planet using a holographic shader material.

import React from 'react'
import { useHolographicMaterial } from '../shaders/HolographicMaterial.jsx'

/**
 * Planet
 * Renders a sphere at the given position using the custom holographic shader.
 * 
 * Props:
 * @param {Array} position - [x, y, z] coordinates for the planet's position in 3D space.
 *                           Defaults to [0, 0, 0] if not provided. 
 */

function Planet({ position = [0, 0, 0], name, onClick }) {
    // Retrieve the shader material and time reference from the custom hook
    const { material, ref } = useHolographicMaterial()
    
    const handleClick = () => {
        if (onClick) onClick(name)
    }

    return (
        // Create a mesh (3D object) using a sphere geometry and the holographic shader material
        <mesh position={position} onClick={handleClick}>
            <sphereGeometry args={[1, 32, 32]} />
            <primitive object={material} attach="material" ref={ref} />
        </mesh>
    )
}

export default Planet
