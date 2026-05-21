'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { createTaskSchema, type CreateTaskSchema } from '@/lib/validation'
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '../../ui/field'

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from '../../ui/combobox'

import { DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog'

import { Controller } from 'react-hook-form'
import { Plus, XIcon } from 'lucide-react'

import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { useEffect } from 'react'
import { useBoardStore } from '@/providers/board-store-provider'
import { Button } from '../../ui/button'
import { Task } from '@/mocks/task.mock'

function CreateTaskDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const columns = useBoardStore((s) => s.columns) ?? []
  const setColumns = useBoardStore((s) => s.setColumns)

  const form = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      subtasks: [{ title: '' }],
      column: ''
    }
  })
  const { isSubmitting } = form.formState
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'subtasks'
  })

  useEffect(() => {
    if (open === false) {
      form.reset()
    }
  }, [open, form])

  async function onSubmit(values: CreateTaskSchema) {
    const previousColumns = columns
    const targetColumnId = values.column

    // --- OPTIMISTIC ---
    const tempTask: Task = {
      id: `temp-${crypto.randomUUID()}`,
      title: values.title,
      description: values.description,
      columnId: targetColumnId,
      position: (columns.find((c) => String(c.id) == targetColumnId)?.Task.length ?? 0) + 1,
      createdAt: new Date().toISOString(),
      SubTask: values.subtasks.map((s, i) => ({
        id: `temp-sub-${Date.now()}-${i}`,
        title: s.title,
        taskId: `temp-${Date.now()}`,
        isCompleted: false
      }))
    }
    setColumns(
      columns.map((col) =>
        String(col.id) == targetColumnId ? { ...col, Task: [...col.Task, tempTask] } : col
      )
    )
    form.reset()
    setOpen(false)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/tasks`, {
        method: 'POST',
        body: JSON.stringify(values),
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
      })

      if (!res.ok) {
        setColumns(previousColumns)
        console.error('Failed to create task')
        return
      }

      const { task }: { task: Task } = await res.json()
      // Replace temp task with real one
      setColumns(
        previousColumns.map((col) =>
          String(col.id) == targetColumnId ? { ...col, Task: [...col.Task, task] } : col
        )
      )
    } catch (error) {
      setColumns(previousColumns)
      console.error(error)
    }
  }

  return (
    <DialogContent
      aria-describedby={undefined}
      className="rounded-modal modal-content bg-kpanal gap-8"
    >
      <DialogHeader>
        <DialogTitle className="bold-20 text-foreground">Add New Task</DialogTitle>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className="field-label">
                  Title
                </FieldLabel>
                <Input
                  {...field}
                  className="field-input"
                  id={field.name}
                  placeholder="Enter task"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  disabled={isSubmitting}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className="field-label">
                  Description
                </FieldLabel>
                <Textarea
                  {...field}
                  className="field-input resize-none max-h-29 h-29!"
                  id={field.name}
                  placeholder="Enter description for the task"
                  aria-invalid={fieldState.invalid}
                  disabled={isSubmitting}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <FieldSet className="gap-4">
            <FieldLegend variant="label" className="field-label">
              Subtasks
            </FieldLegend>
            <FieldGroup className="gap-3">
              {fields.map((item, index) => (
                <Controller
                  key={item.id}
                  name={`subtasks.${index}.title`}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                      <div className="flex items-center gap-2">
                        <Input
                          {...field}
                          id={`subtask-${index}`}
                          placeholder="Enter subtask name"
                          className="field-input"
                          aria-invalid={fieldState.invalid}
                          disabled={isSubmitting}
                        />
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                          aria-label={`Remove subtask ${index + 1}`}
                        >
                          <XIcon className="size-5" />
                        </Button>
                      </div>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              ))}
            </FieldGroup>

            <Button
              onClick={() => append({ title: '' })}
              className="w-full bg-neutral-900 dark:bg-white text-ksecondary flex h-11 items-center justify-center gap-2 rounded-full bold-14"
              type="button"
              disabled={isSubmitting}
            >
              <Plus data-icon="inline-start" />
              Add New Subtask
            </Button>
          </FieldSet>

          <Controller
            name="column"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="column" className="field-label">
                  Column
                </FieldLabel>
                <Combobox
                  items={columns.map((c) => c.name)}
                  value={columns.find((c) => String(c.id) === field.value)?.name ?? ''}
                  onValueChange={(name) => {
                    const col = columns.find((c) => c.name === name)
                    if (col) field.onChange(String(col.id))
                  }}
                >
                  <ComboboxInput
                    className="w-full rounded-input h-11.5 bg-kpanal px-4 py-3"
                    id="column"
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                    placeholder="Choose Column"
                  />
                  <ComboboxContent>
                    <ComboboxList className="bg-kpanal">
                      {columns.map((column) => (
                        <ComboboxItem key={column.id} value={column.name}>
                          {column.name}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bold-14 h-13 p-4 w-full rounded-full mt-6 bg-ksecondary text-white"
        >
          {isSubmitting ? 'Creating...' : 'Create New Task'}
        </Button>
      </form>
    </DialogContent>
  )
}

export default CreateTaskDialog
