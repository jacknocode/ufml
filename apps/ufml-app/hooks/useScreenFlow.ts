'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  addEdge,
  Node,
  NodeChange,
} from 'reactflow'
import { parseInput } from '@/utils/parser'
import { createEdge, shouldCreateConnection } from '@/utils/connectionRules'
import { initialInput } from '@/utils/initialInput'
import { alignNodes } from '@/utils/alignNodes'  // alignNodes関数をインポート

interface NodePosition {
  id: string
  position: { x: number; y: number }
}

export function useScreenFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [input, setInput] = useState<string>(initialInput)
  const [showAllRequirements, setShowAllRequirements] = useState<boolean>(true)
  // 選択されたエッジのIDを保持する状態
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)
  // 選択されたノードのIDを保持する状態
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  // ノード位置を保存する状態
  const [savedPositions, setSavedPositions] = useState<NodePosition[]>([])
  const [maintainPositions, setMaintainPositions] = useState<boolean>(true)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  const handleInputChange = useCallback((value: string) => {
    setInput(value)
  }, [])

  // ノードを整列させる関数
  const handleAlignNodes = useCallback(
    (option: 'horizontal' | 'vertical' | 'grid', nodeSet: Node[], gap: number = 200) => {
      // ノードの位置を更新
      const alignedNodes = alignNodes(nodeSet, option, gap);
      
      // 位置情報を保存
      const newPositions = alignedNodes.map(node => ({
        id: node.id,
        position: node.position
      }));
      
      setSavedPositions(newPositions);
      return alignedNodes;
    },
    []
  );

  const handleGenerate = useCallback(() => {
    const { nodes: newNodes, edges: newEdges } = parseInput(
      input,
      showAllRequirements
    )

    let positionedNodes: Node[] = [];

    if (maintainPositions && isInitialized) {
      // 既存のノードの位置を保持
      positionedNodes = newNodes.map(node => {
        const savedPosition = savedPositions.find(pos => pos.id === node.id)
        if (savedPosition) {
          return {
            ...node,
            position: savedPosition.position,
          }
        }
        // 新しいノードは右側に配置
        const maxX = Math.max(...savedPositions.map(pos => pos.position.x), 0)
        return {
          ...node,
          position: { x: maxX + 400, y: 200 },
        }
      })
    } else {
      // 初期レイアウトをグリッド状に整列
      positionedNodes = handleAlignNodes('horizontal', newNodes, 300);
    }
    
    setNodes(positionedNodes);
    setEdges(newEdges);
    
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [input, showAllRequirements, setNodes, setEdges, savedPositions, maintainPositions, isInitialized, handleAlignNodes])

  // ノードの位置が変更された時に保存
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes)
    
    changes.forEach(change => {
      if (change.type === 'position' && 'position' in change && change.position) {
        const position = change.position as { x: number; y: number }
        if (position && typeof position.x === 'number' && typeof position.y === 'number') {
          setSavedPositions(prev => {
            const filtered = prev.filter(pos => pos.id !== change.id)
            return [...filtered, { id: change.id, position: position }]
          })
        }
      }
    })
  }, [onNodesChange])

  // 接続情報をテキストに反映する関数
  const updateInputTextWithConnection = useCallback((sourceId: string, targetId: string, sourceHandle: string) => {
    // テキストエリア要素とカーソル位置を取得
    const textarea = document.querySelector('textarea');
    let cursorPosition: { start: number; end: number } | null = null;

    if (textarea) {
      const textareaElement = textarea as HTMLTextAreaElement;
      cursorPosition = {
        start: textareaElement.selectionStart,
        end: textareaElement.selectionEnd,
      };
    }
    
    const sourceNode = nodes.find(node => node.id === sourceId);
    const targetNode = nodes.find(node => node.id === targetId);
    
    if (!sourceNode || !targetNode) return;
    
    // 入力テキストを行ごとに分割
    const lines = input.split('\n');
    let updatedLines = [...lines];
    
    // ソースノードが楕円ノードの場合
    if (sourceNode.type === 'ellipseNode') {
      // 楕円ノード間の接続を処理
      const sourceName = sourceNode.data.label;
      const targetName = targetNode.data.label;
      
      // 既存の楕円ノード定義を探す
      let ellipseLineIndex = -1;
      let ellipseFound = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // 楕円ノード定義を探す (例: (データ保存) または (データ保存) => 完了画面)
        if (line.startsWith(`(${sourceName})`) || line === `(${sourceName})`) {
          ellipseLineIndex = i;
          ellipseFound = true;
          break;
        }
      }
      
      if (ellipseFound) {
        // 既存の楕円ノード定義を更新
        const currentLine = lines[ellipseLineIndex].trim();
        
        // 既に接続情報がある場合は新しい行を追加
        if (currentLine.includes('=>')) {
          // 既存の接続情報はそのままに、新しい行を追加
          updatedLines.splice(ellipseLineIndex + 1, 0, `(${sourceName}) => ${targetName}`);
        } else {
          // 接続情報を追加
          updatedLines[ellipseLineIndex] = `(${sourceName}) => ${targetName}`;
        }
      } else {
        // 楕円ノード定義が見つからない場合、新しく追加
        // 適切な位置（最後のスクリーン定義の前）を探す
        let insertIndex = lines.length;
        for (let i = lines.length - 1; i >= 0; i--) {
          if (lines[i].trim().startsWith('[') && lines[i].trim().endsWith(']')) {
            insertIndex = i;
            break;
          }
        }
        
        // 新しい楕円ノード定義を追加
        updatedLines.splice(insertIndex, 0, `(${sourceName}) => ${targetName}`);
      }
    } else {
      // 通常のノードからの接続を処理
      // ソースハンドルからアイテムのインデックスを取得
      const itemIndex = parseInt(sourceHandle.split('-')[0]);
      if (isNaN(itemIndex)) return;
      
      let sourceScreenFound = false;
      let currentScreenIndex = -1;
      
      // テキスト内でソースノードのスクリーン名を探す
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('[') && line.endsWith(']')) {
          const screenName = line.slice(1, -1);
          if (screenName === sourceNode.data.label) {
            sourceScreenFound = true;
            currentScreenIndex = i;
          } else if (sourceScreenFound) {
            // 次のスクリーンが見つかった場合、ループを終了
            break;
          }
        } else if (sourceScreenFound && currentScreenIndex !== -1) {
          // スクリーン内のアイテムを処理
          const items = sourceNode.data.items;
          if (itemIndex >= 0 && itemIndex < items.length) {
            const item = items[itemIndex];
            // アイテムの行を特定
            if (line.startsWith(item.type) && line.includes(item.text)) {
              // 既存の接続情報があるかチェック
              if (line.includes('=>')) {
                // 既存の接続情報はそのままに、新しい行を追加
                const baseAction = line.split('=>')[0].trim();
                
                // 既に同じ接続先がある場合は追加しない
                const existingConnections = line.split('=>')[1].trim();
                if (!existingConnections.includes(targetNode.data.label)) {
                  // 新しい接続行を追加（元の行の後に）
                  updatedLines.splice(i + 1, 0, `${baseAction}=> ${targetNode.data.label}`);
                }
              } else {
                // 新しい接続情報を追加
                updatedLines[i] = `${line} => ${targetNode.data.label}`;
              }
              break;
            }
          }
        }
      }
    }
    
    if (updatedLines.join('\n') !== input) {
      // カーソル位置を保存
      const savedStart = cursorPosition?.start ?? 0;
      const savedEnd = cursorPosition?.end ?? 0;
      
      setInput(updatedLines.join('\n'));
      
      // カーソル位置を復元（レンダリング後に実行）
      requestAnimationFrame(() => {
        const updatedTextarea = document.querySelector('textarea');
        if (updatedTextarea) {
          const textareaElement = updatedTextarea as HTMLTextAreaElement;
          textareaElement.focus();
          textareaElement.setSelectionRange(savedStart, savedEnd);
        }
      });
    }
  }, [nodes, input]);

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
        
        // 接続情報をテキストに反映
        updateInputTextWithConnection(params.source!, params.target!, params.sourceHandle!);
      }
    },
    [nodes, setEdges, updateInputTextWithConnection]
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

  // 選択状態をクリアするための関数
  const clearSelectedEdge = useCallback(() => {
    setSelectedEdgeId(null);
  }, []);

  // エッジが選択されたときのハンドラ
  const handleEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      // 同じエッジをクリックした場合は選択解除
      if (selectedEdgeId === edge.id) {
        clearSelectedEdge();
      } else {
        setSelectedEdgeId(edge.id);
      }
      // イベントの伝播を止める（パネルクリックイベントが発生しないようにする）
      event.stopPropagation();
    },
    [selectedEdgeId, clearSelectedEdge]
  );

  // パネル（背景）がクリックされたときのハンドラ
  const handlePaneClick = useCallback(() => {
    // 選択を解除
    clearSelectedEdge();
  }, [clearSelectedEdge]);

  // ノードがクリックされたときのハンドラ
  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    clearSelectedEdge();
    setSelectedNodeId(node.id);
  }, [clearSelectedEdge]);

  // 選択されたエッジに関連するノードのIDを取得する
  const getRelatedNodeIds = useCallback(
    (edgeId: string | null): { sourceId: string | null; targetId: string | null } => {
      if (!edgeId) return { sourceId: null, targetId: null };
      
      const edge = edges.find(e => e.id === edgeId);
      if (!edge) return { sourceId: null, targetId: null };
      
      return {
        sourceId: edge.source,
        targetId: edge.target
      };
    },
    [edges]
  );

  const handleCopyText = useCallback(() => {
    navigator.clipboard.writeText(input)
      .then(() => {
        console.log('テキストをクリップボードにコピーしました');
      })
      .catch(err => {
        console.error('テキストのコピーに失敗しました:', err);
      });
  }, [input]);
  
  return {
    nodes,
    edges,
    input,
    showAllRequirements,
    selectedEdgeId,
    selectedNodeId,
    onNodesChange: handleNodesChange,
    onEdgesChange,
    onConnect,
    handleInputChange,
    handleGenerate,
    handleToggleAllRequirements,
    handleEdgeClick,
    handlePaneClick,
    handleNodeClick,
    clearSelectedEdge,
    getRelatedNodeIds,
    handleCopyText,
    setNodes,
    setEdges,
    setSelectedEdgeId,
    setSelectedNodeId,
    setSavedPositions,
    handleAlignNodes, // alignNodesハンドラーをエクスポート
  }
}
