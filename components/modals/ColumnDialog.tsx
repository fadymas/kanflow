'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Sketch } from '@uiw/react-color'
import { Pipette } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { colors } from '@/mocks/color.model'
import { createColumnSchema, type CreateColumnSchema } from '@/lib/validation'
import { cn } from '@/lib/utils'
import { useBoardStore } from '@/providers/board-store-provider'

import { Button } from '../ui/button'
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '../ui/field'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'

interface Props {
  onSuccess?: () => void
  editId?: string
}

function ColumnDialog({ onSuccess, editId }: Props) {
  const isEditMode = Boolean(editId)
  const activeBoardId = useBoardStore((state) => state.activeBoard?.id)
  const queryClient = useQueryClient()

  const columns = useBoardStore((state) => state.columns)
  const existingColumn = columns.find((column) => column.id == editId)
  console.log(columns, editId)
  const form = useForm<CreateColumnSchema>({
    resolver: zodResolver(createColumnSchema),
    defaultValues: {
      title: '',
      color: colors[0]?.hex ?? ''
    }
  })

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && existingColumn) {
      form.reset({
        title: existingColumn.name ?? '',
        color: existingColumn.color ?? colors[0]?.hex ?? ''
      })
    }
  }, [isEditMode, existingColumn, form])

  const { isSubmitting } = form.formState

  async function onSubmit(values: CreateColumnSchema) {
    try {
      if (isEditMode) {
        // --- EDIT ---
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/columns`, {
          method: 'PATCH',
          body: JSON.stringify({
            columnId: editId,
            name: values.title,
            color: values.color
          }),
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          console.error('Failed to update column:', data)
          return
        }
      } else {
        // --- CREATE ---
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/columns`, {
          method: 'POST',
          body: JSON.stringify({ ...values, boardId: activeBoardId }),
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          console.error('Failed to create column:', data)
          return
        }
      }

      form.reset()
      onSuccess?.()
      queryClient.invalidateQueries({ queryKey: ['columns'] })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <DialogContent aria-describedby={undefined} className="modal-content gap-8 bg-kpanal">
      <DialogHeader>
        <DialogTitle className="bold-20 text-foreground">
          {isEditMode ? 'Edit Column' : 'Create New Column'}
        </DialogTitle>
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
            disabled={isSubmitting}
            className="mt-6 h-13 w-full rounded-full bg-ksecondary p-4 text-white bold-14"
          >
            {isSubmitting
              ? isEditMode
                ? 'Saving...'
                : 'Creating...'
              : isEditMode
                ? 'Save Changes'
                : 'Create New Column'}
          </Button>
        </FieldGroup>
      </form>
    </DialogContent>
  )
}

export default ColumnDialog
