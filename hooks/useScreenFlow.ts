'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
} from 'reactflow'
import { parseInput } from '@/utils/parser'
import { createEdge, shouldCreateConnection } from '@/utils/connectionRules'
import { initialInput } from '@/utils/initialInput'

export function useScreenFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [input, setInput] = useState<string>(initialInput)
  const [showAllRequirements, setShowAllRequirements] = useState<boolean>(true)

  const handleInputChange = useCallback((value: string) => {
    setInput(value)
  }, [])

  const handleGenerate = useCallback(() => {
    const { nodes: newNodes, edges: newEdges } = parseInput(
      input,
      showAllRequirements
    )
    setNodes(newNodes)
    setEdges(newEdges)
  }, [input, showAllRequirements, setNodes, setEdges])

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find(node => node.id === params.source)
      const targetNode = nodes.find(node => node.id === params.target)
      if (
        sourceNode &&
        targetNode &&
        shouldCreateConnection(sourceNode, targetNode)
      ) {
        setEdges(eds =>
          addEdge(
            createEdge(params.source!, params.target!, params.sourceHandle!),
            eds
          )
        )
      }
    },
    [nodes, setEdges]
  )

  const handleToggleAllRequirements = useCallback(() => {
    setShowAllRequirements(prev => {
      const newValue = !prev
      setNodes(nodes =>
        nodes.map(node => ({
          ...node,
          data: { ...node.data, showAllRequirements: newValue },
        }))
      )
      return newValue
    })
  }, [setNodes])

  useEffect(() => {
    handleGenerate()
  }, [handleGenerate])

  return {
    nodes,
    edges,
    input,
    showAllRequirements,
    onNodesChange,
    onEdgesChange,
    onConnect,
    handleInputChange,
    handleGenerate,
    handleToggleAllRequirements,
    setNodes,
    setEdges,
  }
}
