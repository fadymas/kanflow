/* eslint-disable react-hooks/immutability */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, XIcon } from 'lucide-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import {
  createBoardSchema,
  renameBoardSchema,
  type CreateBoardSchema,
  type RenameBoardSchema
} from '@/lib/validation'

import { Button } from '../ui/button'
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '../ui/field'
import { Input } from '../ui/input'
import { useBoardStore } from '@/providers/board-store-provider'
import { useQuery } from '@tanstack/react-query'
import { Board } from '@/mocks/board.mock'

interface Props {
  onSuccess: () => void
  editId?: number | null
}

function BoardDialog({ onSuccess, editId }: Props) {
  const isEditMode = Boolean(editId)
  const queryClient = useQueryClient()

  const setActiveBoard = useBoardStore((state) => state.setActiveBoard)
  const activeBoardID = useBoardStore((state) => state.activeBoardID)

  const { data: boards = [] } = useQuery<Board[]>({
    queryKey: ['boards'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/boards`)
        .then((res) => res.json())
        .then((data) => data.boards ?? [])
  })

  // ---- Create form ----
  const createForm = useForm<CreateBoardSchema>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: { name: '', columns: [{ name: '' }] }
  })

  // ---- Edit form ----
  const editForm = useForm<RenameBoardSchema>({
    resolver: zodResolver(renameBoardSchema),
    defaultValues: { boardId: editId!, name: '' }
  })

  useEffect(() => {
    if (isEditMode && editId) {
      const board = boards.find((b) => b.id === editId)
      editForm.reset({ boardId: editId, name: board?.name ?? '' })
    }
  }, [isEditMode, editId, boards, editForm])

  const form = isEditMode ? editForm : createForm
  const { isSubmitting } = form.formState

  const { fields, append, remove } = useFieldArray({
    control: createForm.control,
    name: 'columns'
  })

  async function onSubmitCreate(values: CreateBoardSchema) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/boards`, {
        method: 'POST',
        body: JSON.stringify(values),
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        console.error('Failed to create board:', data)
        return
      }

      const data = await res.json()
      createForm.reset()
      onSuccess()
      // React Query is the source of truth — invalidate to refetch the updated list
      await queryClient.invalidateQueries({ queryKey: ['boards'] })
      setActiveBoard(data.board.id, data.board.name)
      document.cookie = `active-boardId=${data.board.id}`
      document.cookie = `active-boardName=${data.board.name}`
    } catch (error) {
      console.error(error)
    }
  }

  async function onSubmitEdit(values: RenameBoardSchema) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/boards`, {
        method: 'PATCH',
        body: JSON.stringify(values),
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        console.error('Failed to rename board:', data)
        return
      }

      const data = await res.json()
      // Update active board name in Zustand if it's the one being renamed
      if (activeBoardID === values.boardId) {
        setActiveBoard(values.boardId, data.board.name)
      }
      // React Query is the source of truth — invalidate to refetch the updated list
      await queryClient.invalidateQueries({ queryKey: ['boards'] })
      editForm.reset()
      onSuccess()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <DialogContent className="bg-kpanal modal-content gap-8" aria-describedby={undefined}>
      <DialogHeader>
        <DialogTitle className="text-foreground bold-20">
          {isEditMode ? 'Change Board Name' : 'Add New Board'}
        </DialogTitle>
      </DialogHeader>

      {isEditMode ? (
        // ---- Edit form ----
        <form onSubmit={editForm.handleSubmit(onSubmitEdit)} noValidate>
          <FieldGroup>
            <Controller
              name="name"
              control={editForm.control}
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
      ) : (
        // ---- Create form ----
        <form onSubmit={createForm.handleSubmit(onSubmitCreate)} noValidate>
          <FieldGroup>
            <Controller
              name="name"
              control={createForm.control}
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
                    control={createForm.control}
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
      )}
    </DialogContent>
  )
}

export default BoardDialog
