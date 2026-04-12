'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Sketch } from '@uiw/react-color'
import { Pipette } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'

import { colors } from '@/mocks/color.model'
import { createColumnSchema, type CreateColumnSchema } from '@/lib/validation'
import { cn } from '@/lib/utils'

import { Button } from '../ui/button'
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '../ui/field'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'

function CreateColumn() {
  const form = useForm<CreateColumnSchema>({
    resolver: zodResolver(createColumnSchema),
    defaultValues: {
      title: '',
      color: colors[0]?.hex ?? ''
    }
  })

  function onSubmit(values: CreateColumnSchema) {
    console.log(values)
  }

  return (
    <DialogContent aria-describedby={undefined} className="modal-content gap-8 bg-kpanal">
      <DialogHeader>
        <DialogTitle className="bold-20 text-foreground">Create New Column</DialogTitle>
      </DialogHeader>
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
                          onChange={(color) => {
                            field.onChange(color.hex)
                          }}
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
            className="mt-6 h-13 w-full rounded-full bg-ksecondary p-4 text-white bold-14"
          >
            Create New Column
          </Button>
        </FieldGroup>
      </form>
    </DialogContent>
  )
}

export default CreateColumn
