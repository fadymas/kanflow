'use client'
import { cn } from '@/lib/utils'
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Field, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { colors } from '@/mocks/color.model'
import { Pipette } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Sketch } from '@uiw/react-color'
import { useState } from 'react'
import { Button } from '../ui/button'

function CreateColumn() {
  const [hex, setHex] = useState<string | undefined>()
  return (
    <DialogContent className="modal-content gap-8  bg-kpanal">
      <DialogHeader>
        <DialogTitle className="bold-20 text-foreground">Create New Column</DialogTitle>
      </DialogHeader>
      <form action="">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title" className="field-label">
              Column Name
            </FieldLabel>
            <Input
              className="field-input"
              id="title"
              placeholder="Enter column name"
              name="title"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="color" className="field-label">
              Column Color
            </FieldLabel>
            <RadioGroup
              className="flex flex-wrap gap-4 justify-center"
              name="color"
              value={hex}
              onValueChange={(value) => {
                setHex(value)
              }}
            >
              {colors.map((color) => (
                <RadioGroupItem
                  key={color.name}
                  className={cn('rounded-full size-10')}
                  style={{ backgroundColor: color.hex }}
                  value={color.hex}
                />
              ))}
              <Popover>
                <PopoverTrigger
                  asChild
                  className="rounded-full size-10 bg-neutral-900 dark:bg-kbackground  flex justify-center items-center "
                >
                  <RadioGroupItem
                    className={cn('rounded-full size-10 bg-neutral-900 dark:bg-kbackground')}
                    value={hex!}
                  >
                    <Pipette className=" text-primary-DEFAULT" />
                  </RadioGroupItem>
                </PopoverTrigger>

                <PopoverContent className="bg-transparent w-min ring-0" align="start">
                  <Sketch
                    color={hex}
                    onChange={(color) => {
                      setHex(color.hex)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </RadioGroup>
          </Field>
          <Button
            type="submit"
            className="bold-14 h-13 p-4 w-full rounded-full mt-6 bg-ksecondary text-white "
          >
            Create New Column
          </Button>
        </FieldGroup>
      </form>
    </DialogContent>
  )
}

export default CreateColumn
