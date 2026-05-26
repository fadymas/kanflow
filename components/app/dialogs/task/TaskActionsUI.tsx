'use client'

import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Checkbox } from '@/components/vendor/lightswind/checkbox'
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from '@/components/ui/combobox'
import { Subtask } from '@/mocks/task.mock'
import { Columndb } from '@/mocks/column.mock'

interface TaskActionsUIProps {
  localSubTasks: Subtask[]
  completedCount: number
  columns?: Columndb[]
  selectedColumnValue: string
  taskCurrentColumn: Columndb | undefined
  onToggle: (subTaskId: string, current: boolean) => Promise<void>
  onColumnChange: (newColumnId: string) => Promise<void>
  onSelectedColumnValueChange: (value: string) => void
}

export function TaskActionsUI({
  localSubTasks,
  completedCount,
  columns,
  selectedColumnValue,
  taskCurrentColumn,
  onToggle,
  onColumnChange,
  onSelectedColumnValueChange
}: TaskActionsUIProps) {
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
            className="gap-4 p-3 bg-kpanal border border-kborder rounded-modal max-w-full flex flex-nowrap"
            role="none"
          >
            <Checkbox
              id={`subtask-${subtask.id}`}
              className="rounded-xs size-4"
              checked={subtask.isCompleted}
              onCheckedChange={() => onToggle(subtask.id, subtask.isCompleted)}
            />
            <FieldLabel
              htmlFor={`subtask-${subtask.id}`}
              className={`text-foreground bold-12 w-full text-ellipsis line-clamp-2 whitespace-break-normal wrap-break-word ${
                subtask.isCompleted ? 'line-through text-knetural-default' : ''
              }`}
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
              onSelectedColumnValueChange(value!)
              const newColumnId = columns?.find((col) => col.name === value)?.id
              if (newColumnId && newColumnId !== taskCurrentColumn?.id) {
                onColumnChange(newColumnId)
              }
            }}
          >
            <ComboboxInput className="w-full px-4 py-3 rounded-modal h-11.5 bg-kpanal" />
            <ComboboxContent>
              <ComboboxList>
                {columns?.map((column) => (
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
