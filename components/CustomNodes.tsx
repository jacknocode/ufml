'use client'

import React, { useState, useEffect, memo, useCallback } from 'react'
import { Handle, Position, useReactFlow } from 'reactflow'
import { ToggleLeft, ToggleRight } from 'lucide-react'
import { iconMap } from '@/utils/iconMapping'
import { CustomNodeProps, Requirement } from '@/types'

const RequirementsTable: React.FC<{
  requirements: Requirement[]
  isVisible: boolean
}> = ({ requirements, isVisible }) => {
  if (requirements.length === 0 || !isVisible) return null

  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr>
          <th className="border border-gray-300 px-2 py-1">Category</th>
          <th className="border border-gray-300 px-2 py-1">Requirement</th>
        </tr>
      </thead>
      <tbody>
        {requirements.map((req, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-2 py-1">{req.category}</td>
            <td className="border border-gray-300 px-2 py-1">{req.content}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export const CustomNodePresentation: React.FC<CustomNodeProps> = memo(
  ({ id, data }: CustomNodeProps) => {
    const [showRequirements, setShowRequirements] = useState(
      data.showAllRequirements
    )

    useEffect(() => {
      setShowRequirements(data.showAllRequirements)
    }, [data.showAllRequirements])

    const toggleRequirements = () => {
      setShowRequirements(prev => !prev)
    }

    return (
      <div
        className="bg-white border border-gray-200 rounded-lg min-w-[200px] max-w-[300px] shadow-sm"
      >
        <div className="font-bold bg-gray-50 px-4 py-2 border-b border-gray-200 rounded-tl-lg rounded-tr-lg flex justify-between items-center">
          <span>{data.label}</span>
          <div className="flex items-center">
            {data.requirements.length > 0 && (
              <button
                onClick={toggleRequirements}
                className="text-gray-500 hover:text-gray-700"
                title={
                  showRequirements ? 'Hide requirements' : 'Show requirements'
                }
              >
                {showRequirements ? (
                  <ToggleRight size={16} />
                ) : (
                  <ToggleLeft size={16} />
                )}
              </button>
            )}
          </div>
        </div>
        {data.requirements.length > 0 && (
          <div className="p-2 border-b border-gray-200">
            <RequirementsTable
              requirements={data.requirements}
              isVisible={showRequirements}
            />
          </div>
        )}
        <div className="px-6 py-4">
          {data.items.map((item, index) => {
            if (item.isSeparator) {
              return (
                <hr key={index} className="my-3 border-t border-gray-200" />
              )
            }
            const Icon = item.type !== 'ellipse' ? iconMap[item.type] : null
            return (
              <div
                key={index}
                className="flex items-center gap-3 py-1.5 relative"
              >
                {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                <span className="text-gray-700">{item.text}</span>
                {item.connection && (
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={`${index}-right`}
                    className="!border-gray-300"
                    style={{ right: -28, top: '50%' }}
                  />
                )}
              </div>
            )
          })}
        </div>
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          className="!border-gray-300"
          style={{ left: -4, top: '50%' }}
        />
      </div>
    )
  }
)

export const EllipseNodePresentation: React.FC<CustomNodeProps> = memo(
  ({ id, data }: CustomNodeProps) => {
    return (
      <div
        className="flex items-center justify-center w-60 h-12 bg-gray-50 border border-gray-200 rounded-full shadow-sm relative"
      >
        <span className="text-sm font-bold text-gray-600">{data.label}</span>
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !min-w-[12px] !min-h-[12px] !border-2 !border-gray-300 !bg-white"
          style={{ left: -6, top: '50%' }}
        />
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !min-w-[12px] !min-h-[12px] !border-2 !border-gray-300 !bg-white"
          style={{ right: -6, top: '50%' }}
        />
      </div>
    )
  }
)

// Define nodeTypes outside of any component
export const nodeTypes = {
  screenNode: memo(CustomNodePresentation),
  ellipseNode: memo(EllipseNodePresentation),
}

export default nodeTypes
