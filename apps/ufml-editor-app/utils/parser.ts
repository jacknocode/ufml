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

    // 楕円ノードからの外部接続を処理 (例: (text) => target または (text) ={label}=> target)
    const externalEllipseConnectionMatch = line.match(/^\(([^)]+)\)\s*(={([^}]+)}=>\s*(.+)|=>\s*(.+))$/)
    if (externalEllipseConnectionMatch) {
      const ellipseText = externalEllipseConnectionMatch[1].trim()
      
      // ラベル付き接続かどうかで処理を分岐
      const hasLabel = externalEllipseConnectionMatch[3] !== undefined
      const connectionLabel = hasLabel ? externalEllipseConnectionMatch[3].trim() : undefined
      const connectionTarget = hasLabel ? 
        externalEllipseConnectionMatch[4].trim() : 
        externalEllipseConnectionMatch[5].trim()
      
      ellipseItems.push({
        type: 'ellipse',
        text: ellipseText,
        connection: connectionTarget,
        connectionLabel: connectionLabel
      })
      return
    }
    
    // 通常の楕円ノード (例: (text) または (text1 => text2))
    if (line.startsWith('(') && line.endsWith(')')) {
      const content = line.slice(1, -1)
      
      // 楕円ノード内の接続を処理
      if (content.includes('=>')) {
        const parts = content.split('=>')
        parts.forEach((part, index) => {
          ellipseItems.push({
            type: 'ellipse',
            text: part.trim(),
            connection:
              index < parts.length - 1 ? parts[index + 1].trim() : undefined,
          })
        })
      } else {
        // 通常の楕円ノード（接続なし）
        ellipseItems.push({
          type: 'ellipse',
          text: content.trim()
        })
      }
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
          label: item.connectionLabel || '',
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
    // 通常の一致を試みる
    let targetNodeIndex = nodes.findIndex(
      n => n.data.label === connection.target
    )
    
    // 通常の一致が見つからない場合、括弧を考慮した一致を試みる
    if (targetNodeIndex === -1) {
      // 括弧付きの接続先を検索（例：'name' が '(name)' と一致するか）
      targetNodeIndex = nodes.findIndex(
        n => n.data.label === connection.target.replace(/^\(|\)$/g, '') || 
             `(${n.data.label})` === connection.target
      )
    }
    
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
