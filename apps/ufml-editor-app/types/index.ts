import { Node, Edge, Connection, NodeTypes, EdgeTypes } from 'reactflow'
import { IconType } from '../utils/iconMapping'

export interface ParsedItem {
  type: IconType | 'ellipse'
  text: string
  isSeparator?: boolean
  connection?: string
}

export interface Requirement {
  category: 'P' | 'S' | 'A' | 'U'
  content: string
}

export interface CustomNodeData {
  label: string
  items: ParsedItem[]
  requirements: Requirement[]
  showAllRequirements: boolean
}

export interface CustomNodeProps {
  id: string
  data: CustomNodeData
  onDisconnect?: (id: string) => void
}

export interface FlowPresentationProps {
  nodes: Node[]
  edges: Edge[]
  selectedEdgeId: string | null
  selectedNodeId: string | null
  onNodesChange: (changes: any) => void
  onEdgesChange: (changes: any) => void
  onConnect: (connection: Connection) => void
  onEdgeClick: (event: React.MouseEvent, edge: Edge) => void
  handlePaneClick: (event: React.MouseEvent) => void
  handleNodeClick: (event: React.MouseEvent, node: Node) => void
  input: string
  showAllRequirements: boolean
  handleInputChange: (value: string) => void
  handleGenerate: () => void
  handleToggleAllRequirements: () => void
  handleCopyText: () => void
  reactFlowWrapper: React.RefObject<HTMLDivElement>
  flowRef: React.RefObject<HTMLDivElement>
  nodeTypes: NodeTypes
  edgeTypes: EdgeTypes
  backgroundColor: string
  setBackgroundColor: (color: string) => void
  dotGap: number
  setDotGap: (gap: number) => void
  dotSize: number
  setDotSize: (size: number) => void
  handleAlignNodes: (option: 'horizontal' | 'vertical' | 'grid') => void
  layoutMode: 'bottom' | 'side'
  onToggleLayoutMode: () => void
}

export interface InputAreaProps {
  value: string
  onChange: (value: string) => void
  onGenerate: () => void
  selectedNodeId?: string | null
  showAllRequirements: boolean
  onToggleAllRequirements: () => void
  onToggleColorPicker: () => void
  onAlign: (option: 'horizontal' | 'vertical' | 'grid') => void
  layoutMode: 'bottom' | 'side'
  onToggleLayoutMode: () => void
  onCopy?: () => void
}
