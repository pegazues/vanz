import { EntertainmentItem } from '@/mycomponents/types/entertainmentitem'
import { QueryClient } from '@tanstack/react-query'
import { TMDB_DOMAIN } from './utils'

export const GRAPH_ENDPOINT = 'https://graph.microsoft.com'
export const GRAPH_ACCOUNT_DRIVE_ITEM_URL =
  '/beta/users/{email}/drives/{driveId}/items/{itemId}'

export const queryClient = new QueryClient()

function formatString(template: string, replacements: any) {
  return template.replace(/{(\w+)}/g, (match, key) => replacements[key] || '')
}

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

export const getAccessToken = async (email: string) => {
  const tenant = email.split('@')[1]
  const url = new URL(
    `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
  )

  const body = new URLSearchParams()
  body.append('client_id', process.env.AZURE_CLIENT_ID as string)
  body.append('client_secret', process.env.AZURE_CLIENT_SECRET as string)
  body.append('scope', 'https://graph.microsoft.com/.default')
  body.append('grant_type', 'client_credentials')

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })

  const data = await response.json()
  return data.access_token
}

export const getOneDriveItem = async (
  email: string,
  driveId: string,
  itemId: string,
): Promise<any> => {
  try {
    const token = await getAccessToken(email)

    const url =
      GRAPH_ENDPOINT +
      formatString(GRAPH_ACCOUNT_DRIVE_ITEM_URL, { email, driveId, itemId })

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return res.json()
  } catch (error) {
    console.error(`Error while getting onedrive item: ${error}`)
    throw error
  }
}

export const getTMDBItem = async (
  tmdbId: string,
  type: string,
): Promise<any> => {
  try {
    const url = `${TMDB_DOMAIN}/${type}/${tmdbId}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN_AUTH}`,
      },
    })

    return response.json()
  } catch (error) {
    console.error(`Error while getting tmdb item: ${error}`)
    throw error
  }
}
