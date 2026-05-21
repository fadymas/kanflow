'use client'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from '../../ui/select'
import { boards } from '@/mocks/board.mock'
import { Fragment } from 'react/jsx-runtime'
function MobileNavMenu() {
  return (
    <Select value={boards[0].name}>
      <SelectTrigger className="border-none bg-kpanal! text-[18px] font-bold md:hidden">
        <SelectValue />
        <SelectContent className="bg-kbackground px-2 text-[18px] font-bold py-2">
          <SelectGroup>
            {boards.map((board, i, array) => (
              <Fragment key={board.id}>
                <SelectItem value={board.name}>{board.name}</SelectItem>
                {i !== array.length - 1 && <SelectSeparator className="my-1" />}
              </Fragment>
            ))}
          </SelectGroup>
        </SelectContent>
      </SelectTrigger>
    </Select>
  )
}

export default MobileNavMenu
