function GridMapper(coordinates, gridSize = 200, divisions = 21) {
    const gridLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const match = coordinates.match(/^([A-Ua-u])-([1-9]|1[0-9]|2[0-1])$/)

    if (!match) {
        console.warn(`Invalid grid label: ${label}`)
        return [0, 0, 0]
    }

    const colLetter = match[1].toUpperCase()
    const rowNumber = parseInt(match[2], 10)

    // Convert to zero-based grid indices
    const colIndex = gridLetters.indexOf(colLetter)
    const rowIndex = rowNumber - 1

    // Calculate layout values
    const squareSize = gridSize / (divisions-1)
    const offset = (divisions - 1) / 2

    const x = (colIndex - offset) * squareSize
    const y = -(rowIndex - offset) * squareSize
    const z = 0

    return [x, y, z]
}

export default GridMapper