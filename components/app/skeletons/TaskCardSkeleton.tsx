import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface TaskCardSkeletonProps {
  className?: string
}

export default function TaskCardSkeleton({ className }: TaskCardSkeletonProps) {
  return (
    <div
      className={cn(
        'w-full min-h-24.5 rounded-modal bg-kpanal p-4 flex flex-col gap-3 shadow-[0px_10px_20px_0px_rgba(15,28,44,0.04)]',
        className
      )}
    >
      {/* Title */}
      <Skeleton className="h-5.5 w-3/4 rounded" />
      {/* Subtasks line */}
      <Skeleton className="h-3.5 w-1/3 rounded" />
    </div>
  )
}
