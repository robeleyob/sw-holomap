import rawPlanetData from './planetData.json'
import GridMapper from '../utils/gridMapper'

/**
 * The grid layout configuration, used both for rendering the grid and mapping coordinates.
 */
export const gridSize = 200
export const divisions = 21

/**
 * Convert each planet's coord (e.g., "R-16") into a position vector using GridMapper.
 * Also spread the original data using ...p so we keep name/coord/etc.
 */
const planetData = rawPlanetData.map(p => {
  const basePos = GridMapper(p.coord, gridSize, divisions)
  const offset = p.offset || [0, 0, 0]

  const position = [
    basePos[0] + offset[0],
    basePos[1] + offset[1],
    basePos[2] + offset[2]
  ]

  return {
    ...p,
    position
  }
})

export default planetData