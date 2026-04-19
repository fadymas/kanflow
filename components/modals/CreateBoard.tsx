'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, XIcon } from 'lucide-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { createBoardSchema, type CreateBoardSchema } from '@/lib/validation'

import { Button } from '../ui/button'
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '../ui/field'
import { Input } from '../ui/input'
import { useRouter } from 'next/navigation'
import { useBoardStore } from '@/providers/board-store-provider'

function CreateBoard({ onSuccess }: { onSuccess: () => void }) {
  const router = useRouter()

  const setActiveBoard = useBoardStore((state) => state.setActiveBoard)
  const form = useForm<CreateBoardSchema>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      name: '',
      columns: [{ name: '' }]
    }
  })

  const { isSubmitting } = form.formState

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'columns'
  })

  async function onSubmit(values: CreateBoardSchema) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/boards`, {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          Accept: 'application/json'
        }
      })

      if (res.ok) {
        const data = await res.json()
        onSuccess()
        form.reset()
        setActiveBoard(data.board.id)
        router.refresh()
      }
      //toast
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <DialogContent className="bg-kpanal modal-content gap-8" aria-describedby={undefined}>
      <DialogHeader>
        <DialogTitle className="text-foreground bold-20">Add New Board</DialogTitle>
      </DialogHeader>
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
    </DialogContent>
  )
}

export default CreateBoard
