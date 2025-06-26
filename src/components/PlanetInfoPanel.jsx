import React from 'react'
import '../styles/PlanetInfoPanel.css'

function PlanetInfoPanel({ planet, onClose, visible }) {
    if (!planet) return null

    const { name, coord, description, image, wookiepedia } = planet || {}

    return (
        <div className={`planet-info-panel ${visible ? 'visible' : ''}`}>
            {planet ? (
                <>
                    <div className='planet-image-container'>
                        <img src={image} alt={name} className="planet-image" />
                    </div>

                    <div className="planet-details">
                        <h2>{name}</h2>
                        <p>{description}</p>
                        <p><strong>Coordinates:</strong> {coord}</p>
                        <a href={wookiepedia} target='_blank' rel='noopener noreferrer' className='see-more'>
                            See More
                        </a>
                    </div>
                    <button className='close-button' onClick={onClose}>x</button>
                </>
            ): null}
        </div>
    )
}

export default PlanetInfoPanel