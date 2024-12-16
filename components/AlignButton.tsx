import React, { useState } from 'react'
import {
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter,
  Grid,
} from 'lucide-react'

interface AlignButtonProps {
  onAlign: (option: 'horizontal' | 'vertical' | 'grid') => void
}

export const AlignButton: React.FC<AlignButtonProps> = ({ onAlign }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleAlign = (option: 'horizontal' | 'vertical' | 'grid') => {
    onAlign(option)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-white text-[#3B82F6] border border-[#3B82F6] rounded-lg hover:bg-[#EBF5FF] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
        title="Align nodes"
      >
        <Grid size={16} />
      </button>
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg">
          <button
            onClick={() => handleAlign('horizontal')}
            className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            <AlignHorizontalJustifyCenter size={16} className="mr-2" />
            Horizontal
          </button>
          <button
            onClick={() => handleAlign('vertical')}
            className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            <AlignVerticalJustifyCenter size={16} className="mr-2" />
            Vertical
          </button>
          <button
            onClick={() => handleAlign('grid')}
            className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            <Grid size={16} className="mr-2" />
            Grid
          </button>
        </div>
      )}
    </div>
  )
}
