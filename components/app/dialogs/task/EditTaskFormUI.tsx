'use client'

import { Controller, UseFormReturn } from 'react-hook-form'

import { type EditTaskSchema } from '@/lib/validation'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface EditTaskFormUIProps {
  form: UseFormReturn<EditTaskSchema>
  onSubmit: (values: EditTaskSchema) => Promise<void>
}

export function EditTaskFormUI({ form, onSubmit }: EditTaskFormUIProps) {
  const { isSubmitting } = form.formState

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-2">
              <FieldLabel htmlFor={field.name} className="field-label">Title</FieldLabel>
              <Input
                {...field}
                id={field.name}
                className="field-input"
                placeholder="Enter task title"
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
            <Field data-invalid={fieldState.invalid} className="gap-2">
              <FieldLabel htmlFor={field.name} className="field-label">Description</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                className="field-input resize-none max-h-29 h-29!"
                placeholder="Enter task description"
                aria-invalid={fieldState.invalid}
                disabled={isSubmitting}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 h-13 w-full rounded-full bg-ksecondary p-4 text-white bold-14"
      >
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}
