import React from 'react'
import { EdgeProps, getBezierPath, BezierEdge } from 'reactflow'

const createSelfLoopPath = (
  sourceX: number,
  sourceY: number,
  nodeWidth: number = 200,
  loopHeight: number = 250 // より大きな高さに変更
): string => {
  // 右から下に向かうループを作成
  const startX = sourceX
  const startY = sourceY
  
  // 制御点の計算
  const controlX1 = startX + 250 // よりさらに右に
  const controlY1 = startY // 同じ高さ
  const controlX2 = startX + 36 // よりさらに右に
  const controlY2 = startY + loopHeight + 60// より下に
  const endX = startX - 128 // 少し左に
  const endY = startY + 80 // 少し下に

  return `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`
}

export const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
  source,
  target,
  label,
  labelStyle = {},
  labelBgStyle = {},
}) => {
  // 自己ループの場合
  if (source === target) {
    const path = createSelfLoopPath(sourceX, sourceY)
    
    // 自己ループのラベル位置（ループの右上あたり）
    const labelX = sourceX + 150;
    const labelY = sourceY + 50;
    
    return (
      <>
        <path
          id={id}
          style={style}
          className="react-flow__edge-path"
          d={path}
          markerEnd={markerEnd}
        />
        
        {/* 自己ループのラベル表示 */}
        {label && (
          <foreignObject
            width={100}
            height={40}
            x={labelX - 50}
            y={labelY - 20}
            className="react-flow__edge-label"
            requiredExtensions="http://www.w3.org/1999/xhtml"
          >
            <div
              style={{
                background: '#f8f9fa',
                padding: '3px 6px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 500,
                textAlign: 'center',
                border: '1px solid #e9ecef',
                ...labelBgStyle,
              }}
            >
              <span style={{ ...labelStyle }}>{label}</span>
            </div>
          </foreignObject>
        )}
      </>
    )
  }
  
  // 通常のエッジの場合
  // エッジパスとラベル位置を取得（labelX, labelY を追加）
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.3, // カーブを強くして視認性を向上
  })

  // 選択時のスタイルを設定（ホバー効果なし）
  const pathStyle = {
    ...style,
    strokeWidth: selected ? 3 : 2,
    stroke: selected ? '#3B82F6' : style.stroke || '#9CA3AF',
  };

  return (
    <>
      {/* クリック領域を拡大するための背景パス */}
      <path
        id={`${id}-bg`}
        className="react-flow__edge-path-bg"
        d={edgePath}
        strokeWidth={10}
        stroke="transparent"
        fill="none"
      />
      
      {/* 実際の表示用エッジパス */}
      <path
        id={id}
        style={pathStyle}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      
      {/* エッジラベル表示 */}
      {label && (
        <foreignObject
          width={100}
          height={30}
          x={labelX - 50}
          y={labelY - 15}
          className="react-flow__edge-label"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div
            style={{
              background: '#f8f9fa',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 500,
              textAlign: 'center',
              border: '1px solid #e9ecef',
              boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
              ...labelBgStyle,
            }}
          >
            <span style={{ ...labelStyle }}>{label}</span>
          </div>
        </foreignObject>
      )}
    </>
  )
}

export const edgeTypes = {
  bezier: BezierEdge,
  custom: CustomEdge,
}
