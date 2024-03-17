import { EntertainmentItem } from '@/mycomponents/types/entertainmentitem'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

export const getTitle = (title: string) => {
  return title.split('(')[0].split('[')[0].split('【')[0].trim()
}

type ListData = {
  data: EntertainmentItem[]
  pageIndex: number
  pageSize: number
  nextPage: number | null
}

export const getList = async (
  pageParam: number,
  filter: { type: string; letter: string },
): Promise<ListData> => {
  const res = await fetch(
    `/api/entertainment/list?pageIndex=${pageParam}&pageSize=12`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filter),
    },
  )

  const data = await res.json()
  return data
}
