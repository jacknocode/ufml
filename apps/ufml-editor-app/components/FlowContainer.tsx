'use client'

import React, { useCallback, useRef, useState, useMemo, useEffect } from 'react'
import { useReactFlow } from 'reactflow'
import { FlowPresentation } from '@/components/FlowPresentation'
import { useScreenFlow } from '@/hooks/useScreenFlow'
import { nodeTypes as importedNodeTypes } from '@/components/CustomNodes'
import { edgeTypes as importedEdgeTypes } from '@/components/CustomEdge'
import { alignNodes } from '@/utils/alignNodes'

export function FlowContainer() {
  const {
    nodes,
    edges,
    input,
    showAllRequirements,
    selectedEdgeId,
    selectedNodeId,
    onNodesChange,
    onEdgesChange,
    onConnect,
    handleInputChange,
    handleGenerate,
    handleToggleAllRequirements,
    handleEdgeClick,
    handlePaneClick,
    handleNodeClick,
    getRelatedNodeIds,
    handleCopyText,
    setNodes,
    setEdges,
    setSavedPositions,
  } = useScreenFlow()

  const [backgroundColor, setBackgroundColor] = useState('#f0f0f0')
  const [dotGap, setDotGap] = useState(20)
  const [dotSize, setDotSize] = useState(1)
  const [layoutMode, setLayoutMode] = useState<'bottom' | 'side'>('bottom')

  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const flowRef = useRef<HTMLDivElement>(null)
  const { fitView, fitBounds, getNodes, getViewport } = useReactFlow()

  const handleAlignNodes = useCallback(
    (option: 'horizontal' | 'vertical' | 'grid') => {
      // ノードの位置を更新
      const alignedNodes = alignNodes(nodes, option, 200);
      setNodes(alignedNodes);
      
      // 位置情報を保存
      const newPositions = alignedNodes.map(node => ({
        id: node.id,
        position: node.position
      }));
      setSavedPositions(newPositions);
      
      // ビューを調整
      setTimeout(() => fitView({ padding: 0.2 }), 50);
    },
    [nodes, setNodes, setSavedPositions, fitView]
  )


  const toggleLayoutMode = useCallback(() => {
    setLayoutMode(prevMode => (prevMode === 'bottom' ? 'side' : 'bottom'))
  }, [])

  // 選択されたエッジに関連するノードIDを取得
  const relatedNodeIds = getRelatedNodeIds(selectedEdgeId);

  // 選択されたエッジに関連するノードに特殊なスタイルを適用
  const styledNodes = nodes.map(node => {
    if (node.id === relatedNodeIds.sourceId || node.id === relatedNodeIds.targetId) {
      // ノードタイプに基づいて適切なborder-radiusを設定
      const isEllipseNode = node.type === 'ellipseNode';
      return {
        ...node,
        style: {
          ...node.style,
          borderColor: '#3B82F6', // ブルーのボーダー
          borderWidth: 3, // ボーダー幅を強調
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)', // 青い影を追加
          borderRadius: isEllipseNode ? '9999px' : '0.5rem', // ノードタイプに応じたradius
        }
      };
    }
    return node;
  });

  const memoizedNodeTypes = useMemo(() => importedNodeTypes, []);
  const memoizedEdgeTypes = useMemo(() => importedEdgeTypes, []);

  return (
    <FlowPresentation
      nodes={styledNodes}
      edges={edges}
      selectedEdgeId={selectedEdgeId}
      selectedNodeId={selectedNodeId}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onEdgeClick={handleEdgeClick}
      handlePaneClick={handlePaneClick}
      handleNodeClick={handleNodeClick}
      input={input}
      showAllRequirements={showAllRequirements}
      handleInputChange={handleInputChange}
      handleGenerate={handleGenerate}
      handleToggleAllRequirements={handleToggleAllRequirements}
      handleCopyText={handleCopyText}
      reactFlowWrapper={reactFlowWrapper}
      flowRef={flowRef}
      nodeTypes={memoizedNodeTypes}
      edgeTypes={memoizedEdgeTypes}
      backgroundColor={backgroundColor}
      setBackgroundColor={setBackgroundColor}
      dotGap={dotGap}
      setDotGap={setDotGap}
      dotSize={dotSize}
      setDotSize={setDotSize}
      handleAlignNodes={handleAlignNodes}
      layoutMode={layoutMode}
      onToggleLayoutMode={toggleLayoutMode}
    />
  )
}
