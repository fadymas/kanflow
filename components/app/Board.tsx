'use client'
import { DragDropContext } from '@hello-pangea/dnd'
import Column from './Column'
import TaskDialogModal from './dialogs/task/TaskDialogModal'
import { Columndb } from '@/mocks/column.mock'
import ColumnSkeleton from '@/components/app/skeletons/ColumnSkeleton'
import Image from 'next/image'
import useBoardColumns from '@/hooks/board/useBoardColumns'
import { useTaskDrag } from '@/hooks/task/useTaskDrag'
import { useBoardStore } from '@/providers/board-store-provider'

function Board() {
  const { activeBoard, isLoading, isFetching, columns, setColumns, queryKey } = useBoardColumns()
  const { onDragEnd } = useTaskDrag({ columns, setColumns, queryKey })
  const openTaskId = useBoardStore((state) => state.openTaskId)

  if (!activeBoard) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 w-full h-full">
        <Image
          src="/Illustrations/noActiveBoard_light.png"
          alt="No board selected"
          width={300}
          height={200}
          className="dark:hidden object-contain w-75 h-50"
          loading="eager"
        />
        <Image
          src="/Illustrations/noActiveBoard_dark.png"
          alt="No board selected"
          width={300}
          height={200}
          className="hidden dark:block object-contain w-75 h-50"
          loading="eager"
        />
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-[24px] font-bold text-foreground">No board selected</h2>
        </div>
      </div>
    )
  }

  if (isLoading || (isFetching && columns?.length === 0)) {
    return Array.from({ length: 3 }).map((_, i) => <ColumnSkeleton key={i} taskCount={3} />)
  }

  return (
    <>
      {openTaskId && <TaskDialogModal />}
      <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
        {columns?.map((column: Columndb) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.name}
            color={column.color}
            tasks={column.Task}
          />
        ))}
      </DragDropContext>
      <Column isAddNew />
    </>
  )
}

export default Board
