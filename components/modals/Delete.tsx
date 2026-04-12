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
  deleted: string
  openCallback: () => void
}

function Delete({ type, deleted, openCallback }: DeleteProps) {
  //   function handleDelete() {
  //     // Implement delete logic based on the type (board, column, task)
  //   }
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
      <DialogFooter className="justify-end gap-4 border-none bg-transparent ">
        <Button
          variant="destructive"
          className="flex-1/2 h-13 px-6 py-4 rounded-full"
          onClick={() => openCallback()}
        >
          Delete
        </Button>
        <Button
          className="text-primary-DEFAULT bg-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-400 dark:bg-kbackground flex-1/2  h-13 px-6 py-4 rounded-full"
          onClick={() => openCallback()}
        >
          Cancel
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

export default Delete
