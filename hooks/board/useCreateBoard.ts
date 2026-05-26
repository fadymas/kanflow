import { createBoard } from '@/app/api/boards/createBoard'
import { Board } from '@/mocks/board.mock'
import { useBoardStore } from '@/providers/board-store-provider'
import { createBoardSchema, type CreateBoardSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'
import { useSidebar } from '@/components/ui/sidebar'

interface UseCreateBoardParams {
  onSuccess?: () => void
}

export function useCreateBoard({ onSuccess }: UseCreateBoardParams) {
  const queryClient = useQueryClient()
  const { setOpenMobile } = useSidebar()
  const setActiveBoard = useBoardStore((state) => state.setActiveBoard)

  const form = useForm<CreateBoardSchema>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: { name: '', columns: [{ name: '' }] }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'columns'
  })

  async function onSubmit(values: CreateBoardSchema) {
    const previousBoards = queryClient.getQueryData<Board[]>(['boards']) ?? []

    const tempBoard: Board = {
      id: Date.now(),
      name: values.name,
      ownerId: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    queryClient.setQueryData<Board[]>(['boards'], [...previousBoards, tempBoard])
    form.reset()
    onSuccess?.()
    setOpenMobile(false)
    toast.success('Board created', { description: `"${values.name}" is ready to use.` })

    try {
      const board = await createBoard(values)
      queryClient.setQueryData<Board[]>(['boards'], [...previousBoards, board])
      setActiveBoard(board.id, board.name)
      document.cookie = `active-boardId=${board.id}`
      document.cookie = `active-boardName=${board.name}`
    } catch (error) {
      queryClient.setQueryData<Board[]>(['boards'], previousBoards)
      toast.error('Failed to create board', { description: 'The board has been reverted.' })
      console.error(error)
    }
  }

  return { form, fields, append, remove, onSubmit }
}
