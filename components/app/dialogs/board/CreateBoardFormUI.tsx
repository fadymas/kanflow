'use client'

import { Plus, XIcon } from 'lucide-react'
import { Controller, FieldArrayWithId, UseFormReturn } from 'react-hook-form'

import { type CreateBoardSchema } from '@/lib/validation'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface CreateBoardFormUIProps {
  form: UseFormReturn<CreateBoardSchema>
  onSubmit: (values: CreateBoardSchema) => Promise<void>
  fields: FieldArrayWithId<CreateBoardSchema, 'columns'>[]
  append: (value: { name: string }) => void
  remove: (index: number) => void
}

export function CreateBoardFormUI({ form, onSubmit, fields, append, remove }: CreateBoardFormUIProps) {
  const { isSubmitting } = form.formState

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-2">
              <FieldLabel htmlFor={field.name} className="field-label">
                Board Name
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                className="field-input"
                placeholder="Enter board name"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                disabled={isSubmitting}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <FieldSet className="gap-4">
          <FieldLegend variant="label" className="field-label">
            Board Columns
          </FieldLegend>

          <FieldGroup className="gap-3">
            {fields.map((item, index) => (
              <Controller
                key={item.id}
                name={`columns.${index}.name`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <div className="flex items-center gap-2">
                      <Input
                        {...field}
                        id={`column-${index}`}
                        className="field-input"
                        placeholder="Enter column name"
                        aria-invalid={fieldState.invalid}
                        disabled={isSubmitting}
                      />
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        aria-label={`Remove column ${index + 1}`}
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
            type="button"
            onClick={() => append({ name: '' })}
            disabled={isSubmitting}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-neutral-900 text-ksecondary bold-14 dark:bg-white"
          >
            <Plus data-icon="inline-start" />
            Add New Column
          </Button>
        </FieldSet>
      </FieldGroup>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 h-13 w-full rounded-full bg-ksecondary p-4 text-white bold-14"
      >
        {isSubmitting ? 'Creating...' : 'Create New Board'}
      </Button>
    </form>
  )
}
