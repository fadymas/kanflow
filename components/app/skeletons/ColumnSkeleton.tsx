import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import TaskCardSkeleton from './TaskCardSkeleton'

interface ColumnSkeletonProps {
  taskCount?: number
  className?: string
}

export default function ColumnSkeleton({ taskCount = 3, className }: ColumnSkeletonProps) {
  return (
    <div className={cn('flex flex-col gap-6 min-w-75 w-75 max-w-75 min-h-full', className)}>
      {/* Column header */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-4 h-4 rounded-full" />
        <Skeleton className="h-3.5 w-28 rounded" />
      </div>

      {/* Task cards */}
      <div className="flex flex-col gap-6">
        {Array.from({ length: taskCount }).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
