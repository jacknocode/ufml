import { describe, it, expect } from 'vitest'
import { getComplementaryColor, adjustBrightness } from '../utils/colorUtils'

describe('getComplementaryColor', () => {
  it('returns the complementary (inverted) color of white', () => {
    expect(getComplementaryColor('#ffffff')).toBe('#000000')
  })

  it('returns the complementary color of black', () => {
    expect(getComplementaryColor('#000000')).toBe('#ffffff')
  })

  it('inverts each channel independently', () => {
    // #ff0000 red -> #00ffff cyan
    expect(getComplementaryColor('#ff0000')).toBe('#00ffff')
  })

  it('works without leading hash', () => {
    expect(getComplementaryColor('ffffff')).toBe('#000000')
  })

  it('returns a valid 6-digit hex string', () => {
    const result = getComplementaryColor('#f0f0f0')
    expect(result).toMatch(/^#[0-9a-f]{6}$/)
  })

  it('handles mid-range colors symmetrically', () => {
    const color = '#808080'
    const complement = getComplementaryColor(color)
    // complement of complement should be close to original
    const doubleComplement = getComplementaryColor(complement)
    expect(doubleComplement).toBe(color)
  })
})

describe('adjustBrightness', () => {
  it('does not change color when factor is 1', () => {
    expect(adjustBrightness('#808080', 1)).toBe('#808080')
  })

  it('returns black when factor is 0', () => {
    expect(adjustBrightness('#ffffff', 0)).toBe('#000000')
  })

  it('doubles brightness when factor is 2 (clamped at 255)', () => {
    // #808080 -> r=128, g=128, b=128 -> *2 = 256 -> clamped to 255 = #ffffff
    expect(adjustBrightness('#808080', 2)).toBe('#ffffff')
  })

  it('halves brightness when factor is 0.5', () => {
    // #808080 -> 128 * 0.5 = 64 = 0x40
    expect(adjustBrightness('#808080', 0.5)).toBe('#404040')
  })

  it('returns a valid 6-digit hex string', () => {
    const result = adjustBrightness('#abcdef', 1.2)
    expect(result).toMatch(/^#[0-9a-f]{6}$/)
  })

  it('clamps channels to max 255', () => {
    const result = adjustBrightness('#ffffff', 2)
    expect(result).toBe('#ffffff')
  })

  it('clamps channels to min 0', () => {
    const result = adjustBrightness('#000000', 0.5)
    expect(result).toBe('#000000')
  })

  it('works without leading hash', () => {
    expect(adjustBrightness('ffffff', 0)).toBe('#000000')
  })
})
