import {
  Type,
  PenTool,
  MousePointerClick,
  ArrowRight,
  Table,
  Trash,
  Send,
  Edit,
} from 'lucide-react'

export const iconMap = {
  T: Type,
  E: PenTool,
  B: MousePointerClick,
  A: ArrowRight,
  O: Table,
  delete: Trash,
  send: Send,
  edit: Edit,
}

export type IconType = keyof typeof iconMap
