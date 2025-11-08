import { useState } from 'react'
import { Check } from 'lucide-react'
import { Badge } from '@/shared/ui/badge'
import { Priority, PRIORITY_CONFIG } from '../types'
import { cn } from '@/shared/lib/cn'

interface PriorityBadgeProps {
  priority: Priority
  showIcon?: boolean
  interactive?: boolean
  onPriorityChange?: (priority: Priority) => void
}

export function PriorityBadge({
  priority,
  showIcon = true,
  interactive = false,
  onPriorityChange
}: PriorityBadgeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const config = PRIORITY_CONFIG[priority]
  const Icon = config.icon

  const handleClick = () => {
    if (interactive && onPriorityChange) {
      setShowMenu(!showMenu)
    }
  }

  const handlePrioritySelect = (newPriority: Priority) => {
    onPriorityChange?.(newPriority)
    setShowMenu(false)
  }

  if (!interactive) {
    return (
      <Badge variant={config.variant} className="gap-1">
        {showIcon && <Icon className="h-3 w-3" />}
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="relative">
      <Badge
        variant={config.variant}
        className={cn(
          'gap-1 cursor-pointer transition-all relative overflow-visible',
          'hover:scale-105 hover:shadow-md',
          isHovered && 'ring-2 ring-offset-1',
          config.variant === 'low' && isHovered && 'ring-gray-300',
          config.variant === 'medium' && isHovered && 'ring-amber-300',
          config.variant === 'high' && isHovered && 'ring-rose-300'
        )}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          {showIcon && (
            <>
              <Icon
                className={cn(
                  'h-3 w-3 transition-all',
                  isHovered && 'opacity-0'
                )}
              />
              {isHovered && (
                <Check
                  className={cn(
                    'h-3 w-3 absolute inset-0 transition-all',
                    config.variant === 'low' && 'text-gray-600',
                    config.variant === 'medium' && 'text-amber-700',
                    config.variant === 'high' && 'text-rose-700'
                  )}
                />
              )}
            </>
          )}
        </div>
        {config.label}
      </Badge>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute top-full right-0 mt-2 z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]">
            {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((p) => {
              const pConfig = PRIORITY_CONFIG[p]
              const PIcon = pConfig.icon
              return (
                <button
                  key={p}
                  onClick={() => handlePrioritySelect(p)}
                  className={cn(
                    'w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors',
                    'hover:bg-gray-50',
                    p === priority && 'bg-indigo-50 font-semibold'
                  )}
                >
                  <PIcon
                    className={cn(
                      'h-3.5 w-3.5',
                      p === 'low' && 'text-gray-600',
                      p === 'medium' && 'text-amber-700',
                      p === 'high' && 'text-rose-700'
                    )}
                  />
                  {pConfig.label}
                  {p === priority && (
                    <Check className="h-3.5 w-3.5 ml-auto text-indigo-600" />
                  )}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
