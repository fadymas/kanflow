import { z } from 'zod'

export const createBoardSchema = z.object({
  name: z.string().trim().min(1, 'Board name is required'),
  columns: z
    .array(
      z.object({
        name: z.string().trim().min(1, 'Column name is required')
      })
    )
    .min(1, 'At least one column is required')
})

export type CreateBoardSchema = z.infer<typeof createBoardSchema>

export const createColumnSchema = z.object({
  title: z.string().trim().min(1, 'Column name is required'),
  color: z
    .string()
    .trim()
    .min(1, 'Column color is required')
    .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, 'Enter a valid hex color')
})

export type CreateColumnSchema = z.infer<typeof createColumnSchema>

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Task title is required'),
  description: z.string().trim().min(1, 'Task description is required'),
  subtasks: z
    .array(
      z.object({
        title: z.string().trim().min(1, 'Subtask name is required')
      })
    )
    .min(1, 'At least one subtask is required'),
  column: z.string().trim().min(1, 'Column is required')
})

export type CreateTaskSchema = z.infer<typeof createTaskSchema>
