'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
  Minimize2,
  Maximize2,
  ToggleLeft,
  ToggleRight,
  Palette,
  Grid,
  PanelLeft,
  PanelBottom,
  Copy,
} from 'lucide-react'
import { InputAreaProps } from '@/types'

export const InputArea: React.FC<InputAreaProps> = ({
  value,
  onChange,
  selectedNodeId,
  showAllRequirements,
  onToggleAllRequirements,
  onToggleColorPicker,
  onAlign,
  onCopy,
  layoutMode,
  onToggleLayoutMode,
}) => {
  const [isMinimized, setIsMinimized] = React.useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isUserTyping, setIsUserTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // ユーザーがタイピング中かどうかを検出するハンドラー
  const handleTextareaFocus = useCallback(() => {
    setIsUserTyping(true)
  }, [])
  
  const handleTextareaBlur = useCallback(() => {
    setIsUserTyping(false)
  }, [])
  
  const handleTextareaKeyDown = useCallback(() => {
    setIsUserTyping(true)
    
    // タイピング終了の検出（一定時間キー入力がない場合）
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsUserTyping(false)
    }, 5000) // 5秒間キー入力がなければタイピング終了と判断
  }, [])
  
  // 選択されたノードに対応するテキスト部分にカーソルを移動
  useEffect(() => {
    // ユーザーが現在編集中の場合は、カーソル位置を変更しない
    if (!selectedNodeId || !textareaRef.current || isUserTyping) return;
    
    const lines = value.split('\n');
    
    // ノードIDからノード名を抽出（例: node_0 -> 0）
    const nodeIdParts = selectedNodeId.split('_');
    const nodeType = nodeIdParts[0]; // 'node' または 'ellipse'
    
    if (nodeType === 'node') {
      // スクリーンノードの場合、スクリーン名の行を見つける
      const screenIndex = parseInt(nodeIdParts[1]);
      
      if (!isNaN(screenIndex)) {
        let currentScreenCount = 0;
        let targetLine = -1;
        
        // スクリーンの開始行を見つける
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('[') && line.endsWith(']')) {
            if (currentScreenCount === screenIndex) {
              targetLine = i;
              break;
            }
            currentScreenCount++;
          }
        }
        
        // 見つかった場合、その行の先頭にカーソルを移動
        if (targetLine !== -1) {
          const textarea = textareaRef.current;
          
          // テキストエリアにフォーカス
          textarea.focus();
          
          // カーソル位置を計算（行の先頭）
          const position = lines.slice(0, targetLine).join('\n').length;
          
          // カーソルを設定
          textarea.setSelectionRange(position, position);
          
          // スクロール位置を調整
          const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
          textarea.scrollTop = targetLine * lineHeight;
        }
      }
    } else if (nodeType === 'ellipse') {
      // 楕円ノードの場合、その行を見つける
      const ellipseIndex = parseInt(nodeIdParts[1]);
      if (!isNaN(ellipseIndex)) {
        let currentEllipseCount = 0;
        let targetLine = -1;
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('(') && line.endsWith(')')) {
            if (currentEllipseCount === ellipseIndex) {
              targetLine = i;
              break;
            }
            currentEllipseCount++;
          }
        }
        
        // 見つかった場合、その行の先頭にカーソルを移動
        if (targetLine !== -1) {
          const textarea = textareaRef.current;
          
          // テキストエリアにフォーカス
          textarea.focus();
          
          // カーソル位置を計算（行の先頭）
          const position = lines.slice(0, targetLine).join('\n').length;
          
          // カーソルを設定
          textarea.setSelectionRange(position, position);
          
          // スクロール位置を調整
          const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
          textarea.scrollTop = targetLine * lineHeight;
        }
      }
    }
  }, [selectedNodeId, value, isUserTyping]);

  const buttonClass =
    'w-9 h-9 flex items-center justify-center bg-white text-[#3B82F6] border border-[#3B82F6] rounded-lg hover:bg-[#EBF5FF] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]'

  const renderButtons = () => (
    <>
      {onCopy && (
        <button onClick={onCopy} className={buttonClass} title="UFMLテキストをコピー">
          <Copy size={16} />
        </button>
      )}
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
            <div className="relative w-full h-[calc(100vh-100px)]">
              <textarea
                ref={textareaRef}
                value={value}
                onChange={e => onChange(e.target.value)}
                onFocus={handleTextareaFocus}
                onBlur={handleTextareaBlur}
                onKeyDown={handleTextareaKeyDown}
                className="w-full h-full p-2 text-sm bg-transparent resize-none focus:outline-none border border-[#E5E7EB] rounded mb-2 text-[#1F2937]"
                placeholder="Enter screen flow description..."
              />
            </div>
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
        <div className="relative w-full h-24">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={handleTextareaFocus}
            onBlur={handleTextareaBlur}
            onKeyDown={handleTextareaKeyDown}
            className="w-full h-full p-2 text-sm bg-transparent resize-none focus:outline-none border border-[#E5E7EB] rounded text-[#1F2937]"
            placeholder="Enter screen flow description..."
          />
        </div>
      )}
      <div className="flex justify-start items-center space-x-2 mt-2">
        {renderButtons()}
      </div>
    </div>
  )
}
