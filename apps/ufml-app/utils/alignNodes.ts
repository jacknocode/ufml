import { Node } from 'reactflow'

type AlignmentOption = 'horizontal' | 'vertical' | 'grid'

export function alignNodes(
  nodes: Node[],
  option: AlignmentOption,
  gap: number = 40
): Node[] {
  const sortedNodes = [...nodes].sort((a, b) => a.position.x - b.position.x)

  switch (option) {
    case 'horizontal':
      return alignHorizontally(sortedNodes, gap)
    case 'vertical':
      return alignVertically(sortedNodes, gap)
    case 'grid':
      return alignGrid(sortedNodes, gap)
    default:
      return nodes
  }
}

function alignHorizontally(nodes: Node[], gap: number): Node[] {
  let currentX = 0
  const avgY =
    nodes.reduce((sum, node) => sum + node.position.y, 0) / nodes.length

  return nodes.map(node => {
    const newNode = {
      ...node,
      position: {
        x: currentX,
        y: avgY,
      },
    }
    currentX += (node.width || 0) + gap
    return newNode
  })
}

function alignVertically(nodes: Node[], gap: number): Node[] {
  let currentY = 0
  const avgX =
    nodes.reduce((sum, node) => sum + node.position.x, 0) / nodes.length

  return nodes.map(node => {
    const newNode = {
      ...node,
      position: {
        x: avgX,
        y: currentY,
      },
    }
    currentY += (node.height || 0) + gap
    return newNode
  })
}

function alignGrid(nodes: Node[], gap: number): Node[] {
  const cols = Math.ceil(Math.sqrt(nodes.length))
  let currentX = 0
  let currentY = 0
  let maxHeightInRow = 0

  return nodes.map((node, index) => {
    if (index % cols === 0 && index !== 0) {
      currentX = 0
      currentY += maxHeightInRow + gap
      maxHeightInRow = 0
    }

    const newNode = {
      ...node,
      position: {
        x: currentX,
        y: currentY,
      },
    }

    currentX += (node.width || 0) + gap
    maxHeightInRow = Math.max(maxHeightInRow, node.height || 0)

    return newNode
  })
}
