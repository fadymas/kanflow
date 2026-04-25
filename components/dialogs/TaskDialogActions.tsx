/* eslint-disable react-hooks/set-state-in-effect */
'use client'
import { useState, useEffect } from 'react'
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '../ui/field'
import { Checkbox } from '../vendor/lightswind/checkbox'
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from '../ui/combobox'
import { Subtask } from '@/mocks/task.model'
import { useBoardStore } from '@/providers/board-store-provider'

export default function TaskDialogActions({
  subTasks,
  columnId,
  taskId
}: {
  subTasks: Subtask[]
  columnId: string
  taskId: string
}) {
  const columns = useBoardStore((state) => state.columns)
  const moveTask = useBoardStore((state) => state.moveTask)

  const taskCurrentColumn = columns.find((column) => column.id == columnId)
  const [localSubTasks, setLocalSubTasks] = useState(subTasks)
  const [selectedColumnValue, setSelectedColumnValue] = useState(taskCurrentColumn?.name || '')

  // Update selected column value when the task moves to a different column
  useEffect(() => {
    setSelectedColumnValue(taskCurrentColumn?.name || '')
  }, [taskCurrentColumn?.name])

  async function handleToggle(subTaskId: string, current: boolean) {
    const next = !current

    // Optimistic update
    setLocalSubTasks((prev) =>
      prev.map((s) => (s.id === subTaskId ? { ...s, isCompleted: next } : s))
    )

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/sub-tasks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ subTaskId, isCompleted: next })
      })

      if (!res.ok) {
        // Revert on failure
        setLocalSubTasks((prev) =>
          prev.map((s) => (s.id === subTaskId ? { ...s, isCompleted: current } : s))
        )
        console.error('Failed to update subtask')
      }
    } catch (error) {
      // Revert on failure
      setLocalSubTasks((prev) =>
        prev.map((s) => (s.id === subTaskId ? { ...s, isCompleted: current } : s))
      )

      console.error(error)
    }
  }
  const completedCount = localSubTasks.filter((s) => s.isCompleted).length

  async function handleColumnChange(newColumnId: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/tasks/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ taskId, columnId: newColumnId })
      })
      if (res.ok) {
        const data = await res.json()
        moveTask(taskId, columnId, newColumnId, data.task)
      }
    } catch (error) {
      console.log(error)
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
              const NewcolumnId = columns.find((column) => column.name === value)?.id

              if (columnId != NewcolumnId) handleColumnChange(NewcolumnId!)
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
