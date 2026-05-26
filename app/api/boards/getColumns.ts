export async function getColumns(activeBoard: number | undefined | null) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/columns?boardId=${activeBoard}`)
  if (!res.ok) throw new Error('Failed to fetch columns')
  const data = await res.json()
  return data.columns ?? []
}
