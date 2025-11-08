import { Badge } from '@/shared/ui/badge'
import { Priority, PRIORITY_CONFIG } from '../types'

interface PriorityBadgeProps {
  priority: Priority
  showIcon?: boolean
}

export function PriorityBadge({ priority, showIcon = true }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="gap-1">
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  )
}
