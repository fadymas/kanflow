import { editBoard } from '@/app/api/boards/editBoard'
import { Board } from '@/mocks/board.mock'
import { useBoardStore } from '@/providers/board-store-provider'
import { renameBoardSchema, type RenameBoardSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { toast } from 'sonner'

interface UseEditBoardParams {
  editId: number
  onSuccess?: () => void
}

export function useEditBoard({ editId, onSuccess }: UseEditBoardParams) {
  const setActiveBoard = useBoardStore((state) => state.setActiveBoard)
  const activeBoardID = useBoardStore((state) => state.activeBoardID)

  const queryClient = useQueryClient()
  const boards = queryClient.getQueryData<Board[]>(['boards']) ?? []
  const existingBoard = boards.find((b) => b.id === editId)

  const form = useForm<RenameBoardSchema>({
    resolver: zodResolver(renameBoardSchema),
    defaultValues: { boardId: editId, name: existingBoard?.name ?? '' }
  })

  useEffect(() => {
    if (existingBoard) {
      form.reset({ boardId: editId, name: existingBoard.name })
    }
  }, [editId, existingBoard, form])

  async function onSubmit(values: RenameBoardSchema) {
    const previousBoards = queryClient.getQueryData<Board[]>(['boards']) ?? []

    queryClient.setQueryData<Board[]>(
      ['boards'],
      previousBoards.map((b) => (b.id === values.boardId ? { ...b, name: values.name } : b))
    )
    if (activeBoardID === values.boardId) {
      setActiveBoard(values.boardId, values.name)
    }
    form.reset()
    onSuccess?.()
    toast.success('Board renamed', { description: `Renamed to "${values.name}".` })

    try {
      await editBoard(values)
      await queryClient.invalidateQueries({ queryKey: ['boards'] })
    } catch (error) {
      queryClient.setQueryData<Board[]>(['boards'], previousBoards)
      if (activeBoardID === values.boardId) {
        const original = previousBoards.find((b) => b.id === values.boardId)
        if (original) setActiveBoard(original.id, original.name)
      }
      toast.error('Failed to rename board', { description: 'The name has been reverted.' })
      console.error(error)
    }
  }

  return { form, onSubmit }
}
