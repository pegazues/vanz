export type EntertainmentItem = {
  _id: string
  title: string
  parent_folder: string
  parent_folder_onedrive_id: string
  onedrive_item_id: string
  account: string
  webURL: string
  onedrive_id: string
  site_id: string

  imdb_id: string
  genre: string[]
  tmdb_id: string
  popularity: number
  adult: boolean
  budget: number
  release_date: Date
  revenue: number
  status: string
  vote_count: number
  vote_average: number
  type: string
}
