'use client'
import { useState } from 'react'
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '../../ui/field'
import { Checkbox } from '../../vendor/lightswind/checkbox'
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from '../../ui/combobox'
import { Subtask } from '@/mocks/task.mock'
import { useBoardStore } from '@/providers/board-store-provider'
import { useQueryClient } from '@tanstack/react-query'

export default function TaskDialogActions({
  subTasks,
  taskId
}: {
  subTasks: Subtask[]
  columnId: string
  taskId: string
}) {
  const activeBoardID = useBoardStore((state) => state.activeBoardID)
  const columns = useBoardStore((state) => state.columns) ?? []
  const setColumns = useBoardStore((state) => state.setColumns)
  const queryClient = useQueryClient()

  const queryKey = ['columns', activeBoardID]

  // Derive current column name reactively from Zustand — always up to date after moves
  const taskCurrentColumn = columns
    .flatMap((col) => col.Task.map((t) => ({ col, t })))
    .find(({ t }) => t.id === taskId)?.col

  const [localSubTasks, setLocalSubTasks] = useState(subTasks)
  const [selectedColumnValue, setSelectedColumnValue] = useState(taskCurrentColumn?.name || '')

  async function handleToggle(subTaskId: string, current: boolean) {
    const next = !current
    const previousColumns = columns

    setLocalSubTasks((prev) =>
      prev.map((s) => (s.id === subTaskId ? { ...s, isCompleted: next } : s))
    )
    setColumns(
      columns.map((col) => ({
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/sub-tasks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ subTaskId, isCompleted: next })
      })

      if (!res.ok) {
        setLocalSubTasks((prev) =>
          prev.map((s) => (s.id === subTaskId ? { ...s, isCompleted: current } : s))
        )
        setColumns(previousColumns)
        console.error('Failed to update subtask')
      } else {
        queryClient.invalidateQueries({ queryKey })
      }
    } catch (error) {
      setLocalSubTasks((prev) =>
        prev.map((s) => (s.id === subTaskId ? { ...s, isCompleted: current } : s))
      )
      setColumns(previousColumns)
      console.error(error)
    }
  }

  const completedCount = localSubTasks.filter((s) => s.isCompleted).length

  async function handleColumnChange(newColumnId: string) {
    const previousColumns = columns
    const previousColumnName = selectedColumnValue

    const task = columns.flatMap((col) => col.Task).find((t) => t.id === taskId)
    if (!task) return

    const sourceColumnId = task.columnId

    setColumns(
      columns.map((col) => {
        if (col.id === sourceColumnId) {
          return { ...col, Task: col.Task.filter((t) => t.id !== taskId) }
        }
        if (col.id === newColumnId) {
          return { ...col, Task: [...col.Task, { ...task, columnId: newColumnId }] }
        }
        return col
      })
    )

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/tasks/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ taskId, columnId: newColumnId })
      })
      if (!res.ok) {
        setColumns(previousColumns)
        setSelectedColumnValue(previousColumnName)
      }
    } catch (error) {
      setColumns(previousColumns)
      setSelectedColumnValue(previousColumnName)
      console.error(error)
    }
  }

  return (
    <FieldGroup>
      <FieldSet className="min-inline-0">
        <FieldLegend className="bold-12 text-kdescription mb-4">
          Subtasks ({completedCount} of {localSubTasks.length})
        </FieldLegend>
        {localSubTasks.map((subtask) => (
          <Field
            key={subtask.id}
            orientation="horizontal"
            className="gap-4 p-3 bg-ksubtle rounded-modal max-w-full flex flex-nowrap"
            role="none"
          >
            <Checkbox
              id={`subtask-${subtask.id}`}
              className="rounded-xs size-4"
              checked={subtask.isCompleted}
              onCheckedChange={() => handleToggle(subtask.id, subtask.isCompleted)}
            />
            <FieldLabel
              htmlFor={`subtask-${subtask.id}`}
              className={`text-foreground bold-12 w-full text-ellipsis line-clamp-2 whitespace-break-normal wrap-break-word ${subtask.isCompleted ? 'line-through text-knetural-default' : ''}`}
            >
              {subtask.title}
            </FieldLabel>
          </Field>
        ))}
      </FieldSet>
      <FieldSet className="min-inline-0">
        <FieldLegend className="bold-12 text-kdescription mb-4">Current Status</FieldLegend>
        <Field orientation="horizontal">
          <Combobox
            items={columns}
            value={selectedColumnValue}
            onValueChange={(value) => {
              setSelectedColumnValue(value!)
              const newColumnId = columns.find((col) => col.name === value)?.id
              if (newColumnId && newColumnId !== taskCurrentColumn?.id) {
                handleColumnChange(newColumnId)
              }
            }}
          >
            <ComboboxInput className="w-full px-4 py-3 rounded-modal h-11.5 bg-kpanal" />
            <ComboboxContent>
              <ComboboxList>
                {columns.map((column) => (
                  <ComboboxItem key={column.id} value={column.name}>
                    {column.name}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>
      </FieldSet>
    </FieldGroup>
  )
}
