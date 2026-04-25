'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, XIcon } from 'lucide-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { createTaskSchema, type CreateTaskSchema } from '@/lib/validation'

import { Button } from '../ui/button'
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from '../ui/combobox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet
} from '../ui/field'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { useBoardStore } from '@/providers/board-store-provider'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

function CreateTaskDialog() {
  const [open, setOpen] = useState(false)

  const columns = useBoardStore((state) => state.columns)
  const queryClient = useQueryClient()

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
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/tasks`, {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          Accept: 'application/json'
        }
      })

      if (res.ok) {
        form.reset()
        setOpen(false)
        queryClient.invalidateQueries({ queryKey: ['columns'] })
      }
      //toast
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-40 h-12 rounded-full px-6 py-3 gap-2 from-primary-300 to-primary-400 bg-linear-to-r text-white max-md:w-1 max-md:h-1 "
        >
          <Plus />
          <span className="max-md:hidden">Add New Task</span>
        </Button>
      </DialogTrigger>
      {open && (
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
                <FieldDescription>
                  Break the task into smaller steps so it is easier to track progress.
                </FieldDescription>
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
                              <XIcon />
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
      )}
    </Dialog>
  )
}

export default CreateTaskDialog
