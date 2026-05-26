import { toggleSubtask } from '@/app/api/tasks/toggleSubtask'
import { moveTask } from '@/app/api/tasks/moveTask'
import { Subtask } from '@/mocks/task.mock'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useBoardStore } from '@/providers/board-store-provider'

interface UseTaskActionsParams {
  taskId: string
  subTasks: Subtask[]
}

export function useTaskActions({ taskId, subTasks }: UseTaskActionsParams) {
  const columns = useBoardStore((state) => state.columns)
  const setColumns = useBoardStore((state) => state.setColumns)
  const activeBoardId = useBoardStore((state) => state.activeBoardID)
  const queryKey = ['columns', activeBoardId]
  const queryClient = useQueryClient()

  const taskCurrentColumn = columns
    ?.flatMap((col) => col.Task.map((t) => ({ col, t })))
    .find(({ t }) => t.id === taskId)?.col

  const [localSubTasks, setLocalSubTasks] = useState(subTasks)
  const [selectedColumnValue, setSelectedColumnValue] = useState(taskCurrentColumn?.name ?? '')

  const completedCount = localSubTasks.filter((s) => s.isCompleted).length

  async function handleToggle(subTaskId: string, current: boolean) {
    const next = !current
    const previousColumns = columns

    setLocalSubTasks((prev) =>
      prev.map((s) => (s.id === subTaskId ? { ...s, isCompleted: next } : s))
    )
    setColumns(
      columns!.map((col) => ({
        ...col,
        Task: col.Task.map((t) =>
          t.id === taskId
            ? {
                ...t,
                SubTask: t.SubTask.map((s: Subtask) =>
                  s.id === subTaskId ? { ...s, isCompleted: next } : s
                )
              }
            : t
        )
      }))
    )

    try {
      await toggleSubtask(subTaskId, next)
      queryClient.invalidateQueries({ queryKey })
    } catch (error) {
      setLocalSubTasks((prev) =>
        prev.map((s) => (s.id === subTaskId ? { ...s, isCompleted: current } : s))
      )
      setColumns(previousColumns!)
      console.error(error)
    }
  }

  async function handleColumnChange(newColumnId: string) {
    const previousColumns = columns
    const previousColumnName = selectedColumnValue

    const task = columns!.flatMap((col) => col.Task).find((t) => t.id === taskId)
    if (!task) return

    const sourceColumnId = task.columnId
    setColumns(
      columns!.map((col) => {
        if (col.id === sourceColumnId)
          return { ...col, Task: col.Task.filter((t) => t.id !== taskId) }
        if (col.id === newColumnId)
          return { ...col, Task: [...col.Task, { ...task, columnId: newColumnId }] }
        return col
      })
    )

    try {
      await moveTask(taskId, newColumnId)
    } catch (error) {
      setColumns(previousColumns!)
      setSelectedColumnValue(previousColumnName)
      console.error(error)
    }
  }

  return {
    columns,
    localSubTasks,
    selectedColumnValue,
    setSelectedColumnValue,
    completedCount,
    taskCurrentColumn,
    handleToggle,
    handleColumnChange
  }
}
