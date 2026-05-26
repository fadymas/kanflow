import { colors } from '@/mocks/color.mock'
import { Columndb } from '@/mocks/column.mock'
import { createColumnSchema, type CreateColumnSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createColumn } from '@/app/api/columns/createColumn'
import { useBoardStore } from '@/providers/board-store-provider'

interface UseCreateColumnParams {
  onSuccess?: () => void
}

export function useCreateColumn({ onSuccess }: UseCreateColumnParams) {
  const columns = useBoardStore((state) => state.columns)
  const setColumns = useBoardStore((state) => state.setColumns)
  const activeBoardId = useBoardStore((state) => state.activeBoardID)
  const queryClient = useQueryClient()

  const form = useForm<CreateColumnSchema>({
    resolver: zodResolver(createColumnSchema),
    defaultValues: {
      title: '',
      color: colors[0]?.hex ?? ''
    }
  })

  async function onSubmit(values: CreateColumnSchema) {
    const currentColumns = columns ?? []
    const tempId = `temp-${crypto.randomUUID()}`
    const optimisticColumn: Columndb = {
      id: tempId,
      name: values.title,
      color: values.color,
      position: currentColumns.length + 1,
      boardId: String(activeBoardId)!,
      Task: []
    }

    setColumns([...currentColumns, optimisticColumn])
    form.reset()
    onSuccess?.()
    toast.success('Column created', { description: `"${values.title}" has been added.` })

    await createColumn({
      values,
      activeBoardId,
      currentColumns,
      setColumns,
      queryClient
    })
  }

  return { form, onSubmit }
}
