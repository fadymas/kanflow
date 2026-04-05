import { Plus, XIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Field, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'

function CreateBoard() {
  return (
    <DialogContent className="bg-kpanal modal-content gap-8 ">
      <DialogHeader>
        <DialogTitle className="text-foreground bold-20">Add New Board</DialogTitle>
      </DialogHeader>
      <form action="">
        <FieldGroup>
          <Field className="gap-2">
            <FieldLabel htmlFor="name" className="bold-12 text-knetural-default">
              Board Name
            </FieldLabel>
            <Input
              id="name"
              placeholder="Enter board name"
              name="name"
              className="py-3 px-4 rounded-input h-11.5"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="column-1" className="bold-12 text-knetural-default">
              Board Columns
            </FieldLabel>
            <div className="flex items-center mb-3">
              <Input
                id="column-1"
                placeholder="Enter column name"
                className="py-3 px-4 rounded-input h-11.5"
              />
              <Button variant="ghost">
                <XIcon />
              </Button>
            </div>
            <div className="flex items-center mb-3">
              <Input
                id="column-2"
                placeholder="Enter column name"
                className="py-3 px-4 rounded-input h-11.5"
              />
              <Button variant="ghost">
                <XIcon />
              </Button>
            </div>

            <Button
              className="w-full bg-neutral-900 dark:bg-white text-ksecondary flex h-11 items-center justify-center gap-2 rounded-full bold-14"
              type="button"
            >
              <Plus />
              Add New Column
            </Button>
          </Field>
        </FieldGroup>
        <Button
          type="submit"
          className="bold-14 h-13 p-4 w-full rounded-full mt-6 bg-ksecondary text-white "
        >
          Create New Board
        </Button>
      </form>
    </DialogContent>
  )
}

export default CreateBoard
