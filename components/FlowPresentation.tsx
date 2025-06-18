'use client'

import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useRef,
  useMemo,
} from 'react'
import ReactFlow, {
  Controls,
  MiniMap,
  Background,
  Panel,
  useReactFlow,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { InputArea } from '@/components/InputArea'
import { ColorPicker } from '@/components/ColorPicker'
import { FlowPresentationProps } from '@/types'
import { getComplementaryColor, adjustBrightness } from '@/utils/colorUtils'

export const FlowPresentation: React.FC<FlowPresentationProps> = ({
  nodes,
  edges,
  selectedEdgeId,
  selectedNodeId,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onEdgeClick,
  handlePaneClick,
  handleNodeClick,
  input,
  showAllRequirements,
  handleInputChange,
  handleGenerate,
  handleToggleAllRequirements,
  handleCopyText,
  reactFlowWrapper,
  flowRef,
  nodeTypes,
  edgeTypes,
  backgroundColor,
  setBackgroundColor,
  dotGap,
  setDotGap,
  dotSize,
  setDotSize,
  handleAlignNodes,
}) => {
  // コールバック関数のメモ化
  const memoizedOnNodesChange = useCallback(onNodesChange, [onNodesChange]);
  const memoizedOnEdgesChange = useCallback(onEdgesChange, [onEdgesChange]);
  const memoizedOnConnect = useCallback(onConnect, [onConnect]);
  const memoizedOnEdgeClick = useCallback(onEdgeClick, [onEdgeClick]);

  // nodeTypes と edgeTypes もメモ化
  const memoizedNodeTypes = useMemo(() => nodeTypes, [nodeTypes]);
  const memoizedEdgeTypes = useMemo(() => edgeTypes, [edgeTypes]);

  const [showColorPicker, setShowColorPicker] = useState(false)
  const [dotColor, setDotColor] = useState(
    getComplementaryColor(backgroundColor)
  )
  const [dotBrightness, setDotBrightness] = useState(1)
  const [layoutMode, setLayoutMode] = useState<'bottom' | 'side'>('bottom')
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { fitView } = useReactFlow()

  useEffect(() => {
    const baseColor = getComplementaryColor(backgroundColor)
    setDotColor(adjustBrightness(baseColor, dotBrightness))
  }, [backgroundColor, dotBrightness])

  const handleBackgroundColorChange = useCallback(
    (color: string) => {
      setBackgroundColor(color)
      setDotColor(adjustBrightness(getComplementaryColor(color), dotBrightness))
    },
    [setBackgroundColor, dotBrightness]
  )

  const handleDotBrightnessChange = useCallback(
    (brightness: number) => {
      setDotBrightness(brightness)
      setDotColor(
        adjustBrightness(getComplementaryColor(backgroundColor), brightness)
      )
    },
    [backgroundColor]
  )

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setShowColorPicker(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  const toggleLayoutMode = useCallback(() => {
    setLayoutMode(prevMode => (prevMode === 'bottom' ? 'side' : 'bottom'))
  }, [])

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
      resizeTimeoutRef.current = setTimeout(() => {
        if (flowRef.current) {
          flowRef.current.style.height = `${window.innerHeight}px`
          fitView({ padding: 0.2, duration: 200 })
        }
      }, 100)
    })

    if (flowRef.current) {
      resizeObserver.observe(flowRef.current)
    }

    return () => {
      if (flowRef.current) {
        resizeObserver.unobserve(flowRef.current)
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
    }
  }, [fitView])

  const handleResize = useCallback(() => {
    if (flowRef.current) {
      flowRef.current.style.height = `${window.innerHeight}px`
      fitView({ padding: 0.2, duration: 200 })
    }
  }, [fitView])

  return (
    <div className="w-full h-screen" ref={reactFlowWrapper}>
      <div ref={flowRef} className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges.map(edge => {
            const isSelected = edge.id === selectedEdgeId;
            const edgeColor = isSelected ? '#3B82F6' : '#9CA3AF';
            
            // 選択されたエッジの場合、スタイルと矢印の色を変更
            return {
              ...edge,
              style: {
                ...edge.style,
                strokeWidth: isSelected ? 3 : 2,
                stroke: edgeColor,
              },
              // 矢印マーカーも同じ色で更新
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: edgeColor,
                width: 20,
                height: 20,
              },
            };
          })}
          onNodesChange={memoizedOnNodesChange}
          onEdgesChange={memoizedOnEdgesChange}
          onConnect={memoizedOnConnect}
          onEdgeClick={memoizedOnEdgeClick}
          onPaneClick={handlePaneClick}
          onNodeClick={handleNodeClick}
          nodeTypes={memoizedNodeTypes}
          edgeTypes={memoizedEdgeTypes}
          fitViewOptions={{ padding: 0.3 }}
          style={{ background: backgroundColor }}
          fitView
          minZoom={0.1}
          maxZoom={8}
          onResize={handleResize}
        >
          <Controls />
          <MiniMap />
          <Background
            color={dotColor}
            gap={dotGap}
            size={dotSize}
          />
          <Panel
            position={layoutMode === 'bottom' ? 'bottom-center' : 'top-left'}
            className={`bg-transparent p-2 ${layoutMode === 'bottom' ? 'mb-2 w-full max-w-3xl' : ''}`}
          >
            <InputArea
              value={input}
              onChange={handleInputChange}
              onGenerate={handleGenerate}
              selectedNodeId={selectedNodeId}
              showAllRequirements={showAllRequirements}
              onToggleAllRequirements={handleToggleAllRequirements}
              onToggleColorPicker={() => setShowColorPicker(!showColorPicker)}
              onAlign={handleAlignNodes}
              onCopy={handleCopyText}
              layoutMode={layoutMode}
              onToggleLayoutMode={toggleLayoutMode}
            />
          </Panel>
          {showColorPicker && (
            <Panel
              position={layoutMode === 'bottom' ? 'top-left' : 'top-right'}
              className="bg-transparent p-2"
            >
              <ColorPicker
                backgroundColor={backgroundColor}
                onBackgroundColorChange={handleBackgroundColorChange}
                dotBrightness={dotBrightness}
                onDotBrightnessChange={handleDotBrightnessChange}
                dotGap={dotGap}
                onDotGapChange={setDotGap}
                dotSize={dotSize}
                onDotSizeChange={setDotSize}
              />
            </Panel>
          )}
        </ReactFlow>
      </div>
    </div>
  )
}
