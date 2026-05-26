'use client'

import { Subtask } from '@/mocks/task.mock'
import { useTaskActions } from '@/hooks/task/useTaskActions'
import { TaskActionsUI } from './TaskActionsUI'

interface Props {
  subTasks: Subtask[]
  columnId: string
  taskId: string
}

export default function TaskDialogActions({ subTasks, taskId }: Props) {
  const {
    columns,
    localSubTasks,
    selectedColumnValue,
    setSelectedColumnValue,
    completedCount,
    taskCurrentColumn,
    handleToggle,
    handleColumnChange
  } = useTaskActions({ taskId, subTasks })

  return (
    <TaskActionsUI
      localSubTasks={localSubTasks}
      completedCount={completedCount}
      columns={columns}
      selectedColumnValue={selectedColumnValue}
      taskCurrentColumn={taskCurrentColumn}
      onToggle={handleToggle}
      onColumnChange={handleColumnChange}
      onSelectedColumnValueChange={setSelectedColumnValue}
    />
  )
}
