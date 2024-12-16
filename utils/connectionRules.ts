import { Edge, Node, MarkerType } from 'reactflow'

let edgeIdCounter = 0

export const createEdge = (
  source: string,
  target: string,
  sourceHandle: string,
  label?: string
): Edge => ({
  id: `edge_${source}_${target}_${edgeIdCounter++}`,
  source,
  target,
  sourceHandle,
  targetHandle: 'left',
  type: 'smoothstep',
  style: { stroke: '#9CA3AF', strokeWidth: 2 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: '#9CA3AF',
  },
  label,
  labelStyle: { fill: '#4B5563', fontWeight: 700 },
  labelBgStyle: { fill: '#F3F4F6', fillOpacity: 0.7 },
})

export const shouldCreateConnection = (
  sourceNode: Node,
  targetNode: Node
): boolean => {
  const sourceItems = sourceNode.data.items
  return sourceItems.some(
    (item: any) => item.type === 'A' || item.type === 'ellipse'
  )
}
