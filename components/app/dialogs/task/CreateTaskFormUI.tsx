'use client'

import { Controller, FieldArrayWithId, UseFormReturn } from 'react-hook-form'
import { Plus, XIcon } from 'lucide-react'

import { type CreateTaskSchema } from '@/lib/validation'
import { Columndb } from '@/mocks/column.mock'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from '@/components/ui/combobox'

interface CreateTaskFormUIProps {
  form: UseFormReturn<CreateTaskSchema>
  onSubmit: (values: CreateTaskSchema) => Promise<void>
  fields: FieldArrayWithId<CreateTaskSchema, 'subtasks'>[]
  append: (value: { title: string }) => void
  remove: (index: number) => void
  columns?: Columndb[]
}

export function CreateTaskFormUI({
  form,
  onSubmit,
  fields,
  append,
  remove,
  columns
}: CreateTaskFormUIProps) {
  const { isSubmitting } = form.formState

  return (
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
                items={columns?.map((c) => c.name)}
                value={columns?.find((c) => String(c.id) === field.value)?.name ?? ''}
                onValueChange={(name) => {
                  const col = columns?.find((c) => c.name === name)
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
                    {columns?.map((column) => (
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
  )
}
