import { Plus, XIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Field, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from '../ui/combobox'
import { columns } from '@/mocks/column.model'

function CreateTask() {
  return (
    <DialogContent className="rounded-modal modal-content bg-kpanal gap-8">
      <DialogHeader>
        <DialogTitle className="bold-20 text-foreground">Add New Task</DialogTitle>
      </DialogHeader>
      <form action="">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title" className="field-label">
              Title
            </FieldLabel>
            <Input className="field-input" id="title" placeholder="Enter task" name="title" />
          </Field>
          <Field>
            <FieldLabel htmlFor="description" className="field-label">
              Description
            </FieldLabel>
            <Textarea
              className="field-input resize-none max-h-29 h-29!"
              id="description"
              placeholder="Enter description for the task"
              name="description"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="subtask-1" className="field-label">
              Subtasks
            </FieldLabel>
            <div className="flex items-center mb-3">
              <Input id="subtask-1" placeholder="Enter subtask name" className="field-input" />
              <Button variant="ghost" type="button">
                <XIcon />
              </Button>
            </div>
            <div className="flex items-center mb-3">
              <Input id="subtask-2" placeholder="Enter subtask name" className="field-input" />
              <Button variant="ghost" type="button">
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
          <Field>
            <FieldLabel htmlFor="column" className="field-label">
              Column
            </FieldLabel>
            <Combobox items={columns} defaultValue={columns[0].name}>
              <ComboboxInput
                className="w-full px-4 py-3 rounded-input h-11.5 bg-kpanal"
                id="column"
              />
              <ComboboxContent>
                <ComboboxList className="bg-kpanal ">
                  {columns.map((column) => (
                    <ComboboxItem key={column.id} value={column.name}>
                      {column.name}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>
        </FieldGroup>
        <Button
          type="submit"
          className="bold-14 h-13 p-4 w-full rounded-full mt-6 bg-ksecondary text-white "
        >
          Create New Task
        </Button>
      </form>
    </DialogContent>
  )
}

export default CreateTask
