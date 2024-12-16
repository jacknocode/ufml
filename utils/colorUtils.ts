export function getComplementaryColor(hex: string): string {
  // Remove the hash if it exists
  hex = hex.replace('#', '')

  // Convert to RGB
  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)

  // Invert the colors
  r = 255 - r
  g = 255 - g
  b = 255 - b

  // Convert back to hex
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

export function adjustBrightness(hex: string, factor: number): string {
  // Remove the hash if it exists
  hex = hex.replace('#', '')

  // Convert to RGB
  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)

  // Adjust brightness
  r = Math.min(255, Math.max(0, Math.round(r * factor)))
  g = Math.min(255, Math.max(0, Math.round(g * factor)))
  b = Math.min(255, Math.max(0, Math.round(b * factor)))

  // Convert back to hex
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}
