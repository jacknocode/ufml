'use client'

import React, { useState, useEffect, memo, useCallback } from 'react'
import { Handle, Position, useReactFlow } from 'reactflow'
import { X, ToggleLeft, ToggleRight } from 'lucide-react'
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
    const [showDisconnect, setShowDisconnect] = useState(false)
    const [showRequirements, setShowRequirements] = useState(
      data.showAllRequirements
    )
    const { setEdges } = useReactFlow()

    useEffect(() => {
      setShowRequirements(data.showAllRequirements)
    }, [data.showAllRequirements])

    const toggleRequirements = () => {
      setShowRequirements(prev => !prev)
    }

    const handleDisconnect = useCallback(() => {
      setEdges(edges =>
        edges.filter(edge => edge.source !== id && edge.target !== id)
      )
    }, [id, setEdges])

    return (
      <div
        className="bg-white border border-gray-200 rounded-lg overflow-hidden min-w-[200px] max-w-[300px] shadow-sm"
        onMouseEnter={() => setShowDisconnect(true)}
        onMouseLeave={() => setShowDisconnect(false)}
      >
        <div className="font-bold bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
          <span>{data.label}</span>
          <div className="flex items-center">
            {data.requirements.length > 0 && (
              <button
                onClick={toggleRequirements}
                className="mr-2 text-gray-500 hover:text-gray-700"
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
            {showDisconnect && (
              <button
                onClick={handleDisconnect}
                className="text-gray-500 hover:text-gray-700"
                title="Disconnect all connections"
              >
                <X size={16} />
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
                    className="!w-3 !h-3 !min-w-[12px] !min-h-[12px] !border-2 !border-gray-300 !bg-white"
                    style={{ right: -8, top: '50%' }}
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
          className="!w-3 !h-3 !min-w-[12px] !min-h-[12px] !border-2 !border-gray-300 !bg-white"
          style={{ left: -8, top: '50%' }}
        />
      </div>
    )
  }
)

export const EllipseNodePresentation: React.FC<CustomNodeProps> = memo(
  ({ id, data }: CustomNodeProps) => {
    const [showDisconnect, setShowDisconnect] = useState(false)
    const { setEdges } = useReactFlow()

    const handleDisconnect = useCallback(() => {
      setEdges(edges =>
        edges.filter(edge => edge.source !== id && edge.target !== id)
      )
    }, [id, setEdges])

    return (
      <div
        className="flex items-center justify-center w-32 h-12 bg-gray-50 border border-gray-200 rounded-full shadow-sm relative"
        onMouseEnter={() => setShowDisconnect(true)}
        onMouseLeave={() => setShowDisconnect(false)}
      >
        <span className="text-sm font-bold text-gray-600">{data.label}</span>
        {showDisconnect && (
          <button
            onClick={handleDisconnect}
            className="absolute -top-2 -right-2 w-5 h-5 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700"
            title="Disconnect all connections"
          >
            <X size={12} />
          </button>
        )}
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !min-w-[12px] !min-h-[12px] !border-2 !border-gray-300 !bg-white"
          style={{ left: -6 }}
        />
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !min-w-[12px] !min-h-[12px] !border-2 !border-gray-300 !bg-white"
          style={{ right: -6 }}
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
