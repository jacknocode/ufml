import { Node, Edge } from 'reactflow'
import { IconType } from './iconMapping'
import { createEdge } from './connectionRules'

interface ParseResult {
  nodes: Node[]
  edges: Edge[]
}

interface ParsedItem {
  type: IconType | 'ellipse'
  text: string
  isSeparator?: boolean
  connection?: string
  connectionLabel?: string
}

interface Requirement {
  category: 'P' | 'S' | 'A' | 'U'
  content: string
}

interface NodeData {
  label: string
  items: ParsedItem[]
  requirements: Requirement[]
  showAllRequirements: boolean
}

function parseItems(lines: string[]): {
  regularItems: ParsedItem[]
  ellipseItems: ParsedItem[]
  requirements: Requirement[]
} {
  const regularItems: ParsedItem[] = []
  const ellipseItems: ParsedItem[] = []
  const requirements: Requirement[] = []

  lines.forEach(line => {
    line = line.trim()
    if (!line) return

    if (line.startsWith('//')) {
      const [category, content] = line
        .slice(2)
        .split(':')
        .map(s => s.trim())
      if (['P', 'S', 'A', 'U'].includes(category)) {
        requirements.push({
          category: category as 'P' | 'S' | 'A' | 'U',
          content,
        })
      }
      return
    }

    if (line === '--') {
      regularItems.push({ type: 'O', text: '', isSeparator: true })
      return
    }

    if (line.startsWith('(') && line.endsWith(')')) {
      const content = line.slice(1, -1)
      const parts = content.split('=>')
      parts.forEach((part, index) => {
        ellipseItems.push({
          type: 'ellipse',
          text: part.trim(),
          connection:
            index < parts.length - 1 ? parts[index + 1].trim() : undefined,
        })
      })
      return
    }

    const [type, ...rest] = line.split(' ')
    const text = rest.join(' ')
    const connectionMatch = text.match(/={(.+)}=>(.+)/)
    if (connectionMatch) {
      regularItems.push({
        type: type as IconType,
        text: text.replace(/={.+}=>(.+)/, '').trim(),
        connection: connectionMatch[2].trim(),
        connectionLabel: connectionMatch[1].trim(),
      })
      return
    }

    const simpleConnectionMatch = text.match(/=>\s*(.+)/)
    if (simpleConnectionMatch) {
      regularItems.push({
        type: type as IconType,
        text: text.replace(/=>\s*.+/, '').trim(),
        connection: simpleConnectionMatch[1].trim(),
      })
      return
    }

    regularItems.push({ type: type as IconType, text })
  })

  return { regularItems, ellipseItems, requirements }
}

export function parseInput(
  input: string,
  showAllRequirements: boolean
): ParseResult {
  const lines = input.split('\n')
  const nodes: Node[] = []
  const edges: Edge[] = []
  let currentScreen: string | null = null
  let currentItems: string[] = []
  let nodeId = 0
  let ellipseNodeId = 0
  let pendingConnections: Array<{
    source: string
    target: string
    sourceHandle: string
    label?: string
  }> = []

  function processNode(screen: string, items: string[]) {
    const { regularItems, ellipseItems, requirements } = parseItems(items)

    // Create main screen node
    if (regularItems.length > 0 || requirements.length > 0) {
      const node: Node<NodeData> = {
        id: `node_${nodeId}`,
        type: 'screenNode',
        data: {
          label: screen,
          items: regularItems,
          requirements: requirements,
          showAllRequirements: showAllRequirements,
        },
        position: { x: nodeId * 400, y: nodeId * 200 },
      }
      nodes.push(node)
      nodeId++
    }

    // Create ellipse nodes
    ellipseItems.forEach((item, index) => {
      const ellipseNode: Node = {
        id: `ellipse_${ellipseNodeId}`,
        type: 'ellipseNode',
        data: {
          label: item.text,
          items: [item],
          requirements: [],
          showAllRequirements: showAllRequirements,
        },
        position: {
          x: (nodeId - 1) * 400 + index * 200,
          y: (nodeId - 1) * 200 + 250,
        },
      }
      nodes.push(ellipseNode)
      ellipseNodeId++

      if (item.connection) {
        pendingConnections.push({
          source: `ellipse_${ellipseNodeId - 1}`,
          target: item.connection,
          sourceHandle: 'right',
          label: '',
        })
      }
    })

    // Process connections
    regularItems.forEach((item, itemIndex) => {
      if (item.connection) {
        const targetNodeIndex = nodes.findIndex(
          n => n.data.label === item.connection
        )
        if (targetNodeIndex !== -1) {
          edges.push(
            createEdge(
              `node_${nodeId - 1}`,
              nodes[targetNodeIndex].id,
              `${itemIndex}-right`,
              item.connectionLabel
            )
          )
        } else {
          pendingConnections.push({
            source: `node_${nodeId - 1}`,
            target: item.connection,
            sourceHandle: `${itemIndex}-right`,
            label: item.connectionLabel,
          })
        }
      }
    })
  }

  lines.forEach(line => {
    line = line.trim()
    if (line.startsWith('[') && line.endsWith(']')) {
      if (currentScreen) {
        processNode(currentScreen, currentItems)
        currentItems = []
      }
      currentScreen = line.slice(1, -1)
    } else if (line) {
      currentItems.push(line)
    }
  })

  if (currentScreen && currentItems.length > 0) {
    processNode(currentScreen, currentItems)
  }

  // Process pending connections
  pendingConnections.forEach(connection => {
    const targetNodeIndex = nodes.findIndex(
      n => n.data.label === connection.target
    )
    if (targetNodeIndex !== -1) {
      edges.push(
        createEdge(
          connection.source,
          nodes[targetNodeIndex].id,
          connection.sourceHandle,
          connection.label
        )
      )
    }
  })

  return { nodes, edges }
}
