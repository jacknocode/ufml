import React from 'react'
import { HexColorPicker } from 'react-colorful'

interface ColorPickerProps {
  backgroundColor: string
  onBackgroundColorChange: (color: string) => void
  dotBrightness: number
  onDotBrightnessChange: (brightness: number) => void
  dotGap: number
  onDotGapChange: (gap: number) => void
  dotSize: number
  onDotSizeChange: (size: number) => void
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  backgroundColor,
  onBackgroundColorChange,
  dotBrightness,
  onDotBrightnessChange,
  dotGap,
  onDotGapChange,
  dotSize,
  onDotSizeChange,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Background Color
        </label>
        <HexColorPicker
          color={backgroundColor}
          onChange={onBackgroundColorChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dot Brightness
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={dotBrightness}
          onChange={e => onDotBrightnessChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Darker</span>
          <span>Original</span>
          <span>Lighter</span>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dot Gap
        </label>
        <input
          type="range"
          min="10"
          max="50"
          value={dotGap}
          onChange={e => onDotGapChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm text-gray-500">{dotGap}px</span>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dot Size
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={dotSize}
          onChange={e => onDotSizeChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm text-gray-500">{dotSize}px</span>
      </div>
    </div>
  )
}
