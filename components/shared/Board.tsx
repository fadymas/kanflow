'use client'
import { columns } from '@/mocks/column.model'
import { DragDropContext } from '@hello-pangea/dnd'
import Column from './Column'
function Board() {
  return (
    <DragDropContext
      onDragEnd={() => {
        console.log('dragged')
      }}
    >
      {columns.map((column) => (
        <Column
          key={column.id}
          id={column.id}
          title={column.name}
          color={column.color}
          tasks={column.tasks}
        />
      ))}
    </DragDropContext>
  )
}

export default Board
