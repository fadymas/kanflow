'use client'

import { Sketch } from '@uiw/react-color'
import { Pipette } from 'lucide-react'
import { Controller, UseFormReturn } from 'react-hook-form'

import { colors } from '@/mocks/color.mock'
import { type CreateColumnSchema } from '@/lib/validation'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface ColumnFormUIProps {
  form: UseFormReturn<CreateColumnSchema>
  onSubmit: (values: CreateColumnSchema) => Promise<void>
  isEditMode?: boolean
}

export function ColumnFormUI({ form, onSubmit, isEditMode = false }: ColumnFormUIProps) {
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
                Column Name
              </FieldLabel>
              <Input
                {...field}
                className="field-input"
                id={field.name}
                placeholder="Enter column name"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                disabled={isSubmitting}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="color"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldSet className="gap-4">
              <FieldLegend variant="label" className="field-label">
                Column Color
              </FieldLegend>

              <Field data-invalid={fieldState.invalid}>
                <RadioGroup
                  className="flex flex-wrap justify-center gap-4"
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {colors.map((color) => (
                    <RadioGroupItem
                      key={color.name}
                      className={cn('size-10 rounded-full')}
                      style={{ backgroundColor: color.hex }}
                      value={color.hex}
                      aria-invalid={fieldState.invalid}
                    />
                  ))}

                  <Popover>
                    <PopoverTrigger
                      asChild
                      className="flex size-10 items-center justify-center rounded-full bg-neutral-900 dark:bg-kbackground"
                    >
                      <RadioGroupItem
                        className={cn('size-10 rounded-full bg-neutral-900 dark:bg-kbackground')}
                        value={field.value}
                        aria-invalid={fieldState.invalid}
                      >
                        <Pipette className="text-primary-DEFAULT" />
                      </RadioGroupItem>
                    </PopoverTrigger>

                    <PopoverContent className="w-min bg-transparent ring-0" align="start">
                      <Sketch
                        color={field.value}
                        onChange={(color) => field.onChange(color.hex)}
                      />
                    </PopoverContent>
                  </Popover>
                </RadioGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            </FieldSet>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 h-13 w-full rounded-full bg-ksecondary p-4 text-white bold-14"
        >
          {isSubmitting
            ? isEditMode ? 'Saving...' : 'Creating...'
            : isEditMode ? 'Save Changes' : 'Create New Column'}
        </Button>
      </FieldGroup>
    </form>
  )
}
