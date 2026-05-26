'use client'

import { Controller, UseFormReturn } from 'react-hook-form'

import { type RenameBoardSchema } from '@/lib/validation'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface EditBoardFormUIProps {
  form: UseFormReturn<RenameBoardSchema>
  onSubmit: (values: RenameBoardSchema) => Promise<void>
}

export function EditBoardFormUI({ form, onSubmit }: EditBoardFormUIProps) {
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
