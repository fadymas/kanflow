import { colors } from '@/mocks/color.mock'
import { createColumnSchema, type CreateColumnSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { editColumn } from '@/app/api/columns/editColumn'
import { useBoardStore } from '@/providers/board-store-provider'

interface UseEditColumnParams {
  editId: string
  onSuccess?: () => void
}

export function useEditColumn({ editId, onSuccess }: UseEditColumnParams) {
  const activeBoardId = useBoardStore((state) => state.activeBoardID)
  const columns = useBoardStore((state) => state.columns)
  const setColumns = useBoardStore((state) => state.setColumns)

  const queryClient = useQueryClient()

  const existingColumn = columns?.find((col) => col.id === editId)

  const form = useForm<CreateColumnSchema>({
    resolver: zodResolver(createColumnSchema),
    defaultValues: {
      title: existingColumn?.name ?? '',
      color: existingColumn?.color ?? colors[0]?.hex ?? ''
    }
  })

  useEffect(() => {
    if (existingColumn) {
      form.reset({
        title: existingColumn.name ?? '',
        color: existingColumn.color ?? colors[0]?.hex ?? ''
      })
    }
  }, [existingColumn, form])

  async function onSubmit(values: CreateColumnSchema) {
    const currentColumns = columns ?? []
    const previousColumns = currentColumns
    const optimisticColumns = currentColumns.map((col) =>
      col.id == editId ? { ...col, name: values.title, color: values.color } : col
    )

    setColumns(optimisticColumns)
    form.reset()
    onSuccess?.()
    toast.success('Column updated', { description: `"${values.title}" has been updated.` })

    await editColumn({
      values,
      activeBoardId,
      editId,
      previousColumns,
      setColumns,
      queryClient
    })
  }

  return { form, onSubmit }
}
