'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useBoardStore } from '@/providers/board-store-provider'
import { Board } from '@/mocks/board.mock'

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog'
import { Button } from '../ui/button'

interface DeleteProps {
  type: 'Task' | 'Board' | 'Column'
  id?: number
  deleted?: string
  openCallback: () => void
}

function DeleteDialog({ type, id, deleted, openCallback }: DeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const queryClient = useQueryClient()

  const clearActiveBoard = useBoardStore((state) => state.clearActiveBoard)
  const setActiveBoard = useBoardStore((state) => state.setActiveBoard)
  const setOpenTaskId = useBoardStore((state) => state.setOpenTaskId)
  const activeBoard = useBoardStore((state) => state.activeBoardID)
  const columns = useBoardStore((state) => state.columns)
  const setColumns = useBoardStore((state) => state.setColumns)

  async function handleDelete() {
    setIsDeleting(true)

    const previousBoards = queryClient.getQueryData<Board[]>(['boards']) ?? []
    const previousColumns = columns ?? []

    const urlMap = {
      Task: `${process.env.NEXT_PUBLIC_URL}/api/tasks?taskId=${id}`,
      Column: `${process.env.NEXT_PUBLIC_URL}/api/columns?columnId=${id}`,
      Board: `${process.env.NEXT_PUBLIC_URL}/api/boards?boardId=${id}`
    }

    // --- OPTIMISTIC UPDATE ---
    if (type === 'Board') {
      const remaining = previousBoards.filter((b) => b.id !== id)
      queryClient.setQueryData<Board[]>(['boards'], remaining)
      if (remaining.length > 0) {
        setActiveBoard(remaining[0].id, remaining[0].name)
        document.cookie = `active-boardId=${remaining[0].id}`
        document.cookie = `active-boardName=${remaining[0].name}`
      } else {
        clearActiveBoard()
        document.cookie = `active-boardId=null`
        document.cookie = `active-boardName=null`
      }
    } else if (type === 'Column') {
      setColumns(previousColumns.filter((col) => col.id != String(id)))
    } else if (type === 'Task') {
      setColumns(
        previousColumns.map((col) => ({
          ...col,
          Task: col.Task.filter((t) => t.id != String(id))
        }))
      )
    }
    openCallback()
    setOpenTaskId(null)

    try {
      const res = await fetch(urlMap[type], { method: 'DELETE' })

      if (res.ok) {
        if (type === 'Board') {
          await queryClient.invalidateQueries({ queryKey: ['boards'] })
          queryClient.invalidateQueries({ queryKey: ['columns', activeBoard] })
        } else if (type === 'Column') {
          queryClient.setQueryData(
            ['columns', activeBoard],
            [...previousColumns.filter((col) => col.id != String(id))]
          )
        } else if (type === 'Task') {
          queryClient.setQueryData(
            ['columns', activeBoard],
            previousColumns.map((col) => ({
              ...col,
              Task: col.Task.filter((t) => t.id != String(id))
            }))
          )
          setOpenTaskId(null)
        }
      } else {
        // --- ROLLBACK ---
        if (type === 'Board') {
          queryClient.setQueryData<Board[]>(['boards'], previousBoards)
          const active = previousBoards.find((b) => b.id === activeBoard)
          if (active) setActiveBoard(active.id, active.name)
        } else {
          setColumns(previousColumns)
        }
        console.error(`Failed to delete ${type}`)
      }
    } catch (error) {
      // --- ROLLBACK ---
      if (type === 'Board') {
        queryClient.setQueryData<Board[]>(['boards'], previousBoards)
        const active = previousBoards.find((b) => b.id === activeBoard)
        if (active) setActiveBoard(active.id, active.name)
      } else {
        setColumns(previousColumns)
      }
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <DialogContent aria-describedby={undefined} className="bg-kpanal modal-content gap-8">
      <DialogHeader>
        <DialogTitle className="text-destructive bold-20">
          {type === 'Board' && `Delete "${deleted}" board?`}
          {type === 'Task' && `Delete "${deleted}" task?`}
          {type === 'Column' && `Delete "${deleted}" column?`}
        </DialogTitle>
      </DialogHeader>
      <DialogDescription className="line-clamp-3 text-ellipsis text-[16px] font-medium">
        {type === 'Board' &&
          `Are you sure you want to delete the "${deleted}" board? This action will remove all columns and tasks and cannot be reversed.`}
        {type === 'Task' &&
          `Are you sure you want to delete the "${deleted}" task? This action cannot be reversed.`}
        {type === 'Column' &&
          `Are you sure you want to delete the "${deleted}" column? This action will remove all tasks and cannot be reversed.`}
      </DialogDescription>
      <DialogFooter className="justify-end gap-4 border-none bg-transparent">
        <Button
          variant="destructive"
          className="flex-1/2 h-13 px-6 py-4 rounded-full"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
        <Button
          className="text-primary-DEFAULT bg-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-400 dark:bg-kbackground flex-1/2 h-13 px-6 py-4 rounded-full"
          disabled={isDeleting}
          onClick={() => openCallback()}
        >
          Cancel
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

export default DeleteDialog
