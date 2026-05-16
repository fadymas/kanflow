'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogTrigger } from '../ui/dialog'
import CreateTaskDialog from './CreateTaskDialog'
import { useBoardStore } from '@/providers/board-store-provider'

function CreateTask() {
  const [open, setOpen] = useState<boolean>(false)
  const activeBoardId = useBoardStore((s) => s.activeBoardID)

  if (!activeBoardId) return null

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-40 h-12 rounded-full px-6 py-3 gap-2 from-primary-300 to-primary-400 bg-linear-to-r text-white max-md:w-1 max-md:h-1"
        >
          <Plus />
          <span className="max-md:hidden">Add New Task</span>
        </Button>
      </DialogTrigger>
      {open && <CreateTaskDialog open={open} setOpen={setOpen} />}
    </Dialog>
  )
}

export default CreateTask
