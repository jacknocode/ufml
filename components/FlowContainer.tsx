'use client'

import React, { useCallback, useRef, useState } from 'react'
import { useReactFlow } from 'reactflow'
import { FlowPresentation } from '@/components/FlowPresentation'
import { useScreenFlow } from '@/hooks/useScreenFlow'
import { exportToPDF } from '@/utils/pdfExport'
import { nodeTypes } from '@/components/CustomNodes'
import { edgeTypes } from '@/components/CustomEdge'
import { alignNodes } from '@/utils/alignNodes'

export function FlowContainer() {
  const {
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
  } = useScreenFlow()

  const [backgroundColor, setBackgroundColor] = useState('#f0f0f0')
  const [dotGap, setDotGap] = useState(20)
  const [dotSize, setDotSize] = useState(1)
  const [edgeMode, setEdgeMode] = useState<'bezier' | 'straight' | 'step'>(
    'bezier'
  )
  const [layoutMode, setLayoutMode] = useState<'bottom' | 'side'>('bottom')

  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const flowRef = useRef<HTMLDivElement>(null)
  const { fitView, fitBounds, getNodes, getViewport } = useReactFlow()

  const handleExportPDF = useCallback(() => {
    console.log('Exporting PDF...')
    if (reactFlowWrapper.current) {
      exportToPDF(reactFlowWrapper, fitBounds, getNodes, getViewport, fitView)
        .then(() => console.log('PDF export completed'))
        .catch(error => console.error('PDF export failed:', error))
    } else {
      console.error('reactFlowWrapper is null')
    }
  }, [fitBounds, getNodes, getViewport, fitView])

  const handleAlignNodes = useCallback(
    (option: 'horizontal' | 'vertical' | 'grid') => {
      setNodes(prevNodes => alignNodes(prevNodes, option, 200))
      setTimeout(() => fitView({ padding: 0.2 }), 50)
    },
    [setNodes, fitView]
  )

  const handleEdgeModeChange = useCallback(
    (mode: 'bezier' | 'straight' | 'step') => {
      setEdgeMode(mode)
      setEdges(eds => eds.map(edge => ({ ...edge, type: mode })))
    },
    [setEdges]
  )

  const toggleLayoutMode = useCallback(() => {
    setLayoutMode(prevMode => (prevMode === 'bottom' ? 'side' : 'bottom'))
  }, [])

  return (
    <FlowPresentation
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      input={input}
      showAllRequirements={showAllRequirements}
      handleInputChange={handleInputChange}
      handleGenerate={handleGenerate}
      handleExportPDF={handleExportPDF}
      handleToggleAllRequirements={handleToggleAllRequirements}
      reactFlowWrapper={reactFlowWrapper}
      flowRef={flowRef}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      backgroundColor={backgroundColor}
      setBackgroundColor={setBackgroundColor}
      dotGap={dotGap}
      setDotGap={setDotGap}
      dotSize={dotSize}
      setDotSize={setDotSize}
      handleAlignNodes={handleAlignNodes}
      edgeMode={edgeMode}
      handleEdgeModeChange={handleEdgeModeChange}
      layoutMode={layoutMode}
      onToggleLayoutMode={toggleLayoutMode}
    />
  )
}
