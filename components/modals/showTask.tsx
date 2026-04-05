'use client'
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '../ui/field'
import { Checkbox } from '../lightswind/checkbox'
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from '../ui/combobox'
import { columns } from '@/mocks/column.model'
import { Subtask } from '@/mocks/task.model'

export default function ShowTask({ subTasks }: { subTasks: Subtask[] }) {
  return (
    <FieldGroup>
      <FieldSet className=" min-inline-0">
        <FieldLegend className="bold-12 text-kdescription mb-4">Subtasks (2 of 3)</FieldLegend>
        {/* subtasks */}
        {subTasks.map((subtask) => (
          <Field
            key={subtask.id}
            orientation="horizontal"
            className="gap-4  p-3 bg-ksubtle rounded-[1rem] max-w-full flex flex-nowrap"
            role="none"
          >
            <Checkbox id="task-1" className=" rounded-xs size-4 " checked={subtask.isCompleted} />
            <FieldLabel
              htmlFor="task-1"
              className={`text-foreground bold-12 w-full  text-ellipsis  line-clamp-2 whitespace-break-normal wrap-break-word ${subtask.isCompleted ? 'line-through text-knetural-default' : ''}`}
            >
              {subtask.title}
            </FieldLabel>
          </Field>
        ))}
      </FieldSet>
      <FieldSet className=" min-inline-0">
        <FieldLegend className="bold-12 text-kdescription mb-4">Current Status</FieldLegend>
        <Field orientation="horizontal">
          {/* compobox */}
          <Combobox items={columns} defaultValue={columns[0].name}>
            <ComboboxInput className="w-full px-4 py-3 rounded-[1rem] h-11.5 bg-kpanal" />
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
