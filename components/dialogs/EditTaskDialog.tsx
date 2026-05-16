'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'

import { editTaskSchema, type EditTaskSchema } from '@/lib/validation'
import { Button } from '../ui/button'
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { useBoardStore } from '@/providers/board-store-provider'

interface Props {
  taskId: number
  title: string
  description: string
  onSuccess: () => void
}

function EditTaskDialog({ taskId, title, description, onSuccess }: Props) {
  const queryClient = useQueryClient()
  const activeBoardID = useBoardStore((state) => state.activeBoardID)

  const form = useForm<EditTaskSchema>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: { title, description }
  })

  const { isSubmitting } = form.formState

  async function onSubmit(values: EditTaskSchema) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/tasks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ taskId, ...values })
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        console.error('Failed to edit task:', data)
        return
      }

      await queryClient.invalidateQueries({ queryKey: ['columns', activeBoardID] })
      onSuccess()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <DialogContent className="bg-kpanal modal-content gap-8" aria-describedby={undefined}>
      <DialogHeader>
        <DialogTitle className="text-foreground bold-20">Edit Task</DialogTitle>
      </DialogHeader>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <FieldLabel htmlFor={field.name} className="field-label">
                  Title
                </FieldLabel>
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
                <FieldLabel htmlFor={field.name} className="field-label">
                  Description
                </FieldLabel>
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
    </DialogContent>
  )
}

export default EditTaskDialog
