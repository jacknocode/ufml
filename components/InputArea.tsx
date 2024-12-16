'use client'

import React from 'react'
import {
  FileDown,
  Minimize2,
  Maximize2,
  ToggleLeft,
  ToggleRight,
  Palette,
  Grid,
  ArrowRightCircle,
  PanelLeft,
  PanelBottom,
} from 'lucide-react'
import { InputAreaProps } from '@/types'

export const InputArea: React.FC<InputAreaProps> = ({
  value,
  onChange,
  onExportPDF,
  showAllRequirements,
  onToggleAllRequirements,
  onToggleColorPicker,
  onAlign,
  edgeMode,
  onEdgeModeChange,
  layoutMode,
  onToggleLayoutMode,
}) => {
  const [isMinimized, setIsMinimized] = React.useState(false)

  const buttonClass =
    'w-9 h-9 flex items-center justify-center bg-white text-[#3B82F6] border border-[#3B82F6] rounded-lg hover:bg-[#EBF5FF] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]'

  const renderButtons = () => (
    <>
      <button onClick={onExportPDF} className={buttonClass} title="Export PDF">
        <FileDown size={16} />
      </button>
      <button
        onClick={onToggleAllRequirements}
        className={buttonClass}
        title={
          showAllRequirements
            ? 'Hide all requirements'
            : 'Show all requirements'
        }
      >
        {showAllRequirements ? (
          <ToggleRight size={16} />
        ) : (
          <ToggleLeft size={16} />
        )}
      </button>
      <button
        onClick={onToggleColorPicker}
        className={buttonClass}
        title="Toggle color picker"
      >
        <Palette size={16} />
      </button>
      <button
        onClick={() => onAlign('grid')}
        className={buttonClass}
        title="Align nodes"
      >
        <Grid size={16} />
      </button>
      <button
        onClick={() => {
          const newMode =
            edgeMode === 'bezier'
              ? 'straight'
              : edgeMode === 'straight'
                ? 'step'
                : 'bezier'
          onEdgeModeChange(newMode)
        }}
        className={buttonClass}
        title="Change edge mode"
      >
        <ArrowRightCircle size={16} />
      </button>
      <button
        onClick={onToggleLayoutMode}
        className={buttonClass}
        title="Toggle layout mode"
      >
        {layoutMode === 'bottom' ? (
          <PanelLeft size={16} />
        ) : (
          <PanelBottom size={16} />
        )}
      </button>
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className={buttonClass}
        title={isMinimized ? 'Maximize' : 'Minimize'}
      >
        {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
      </button>
    </>
  )

  if (layoutMode === 'side') {
    return (
      <div
        className={`bg-white border border-[#E5E7EB] rounded-lg shadow-sm transition-all duration-300 ${isMinimized ? 'w-13' : 'w-80'}`}
      >
        {!isMinimized && (
          <>
            <textarea
              value={value}
              onChange={e => onChange(e.target.value)}
              className="w-full h-[calc(100vh-100px)] p-2 text-sm bg-transparent resize-none focus:outline-none border border-[#E5E7EB] rounded mb-2 text-[#1F2937]"
              placeholder="Enter screen flow description..."
            />
            <div className="flex flex-wrap gap-2 p-2">{renderButtons()}</div>
          </>
        )}
        {isMinimized && (
          <div className="p-2">
            <button
              onClick={() => setIsMinimized(false)}
              className={buttonClass}
              title="Maximize"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={`w-full bg-white border border-[#E5E7EB] rounded-lg shadow-sm transition-all duration-300 ${isMinimized ? 'h-13 p-1.5' : 'h-41 p-2'}`}
    >
      {!isMinimized && (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full h-24 p-2 text-sm bg-transparent resize-none focus:outline-none border border-[#E5E7EB] rounded mb-2 text-[#1F2937]"
          placeholder="Enter screen flow description..."
        />
      )}
      <div className="flex justify-start items-center space-x-2">
        {renderButtons()}
      </div>
    </div>
  )
}
