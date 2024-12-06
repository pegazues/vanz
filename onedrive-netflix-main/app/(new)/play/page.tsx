'use client'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { toast } from 'sonner'
import ReactPlayer from 'react-player'
import { APITypes } from 'plyr-react'
import 'plyr-react/plyr.css'
import dynamic from 'next/dynamic'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { History, Home, Loader2, Video } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { TooltipContent } from '@radix-ui/react-tooltip'
import WatchHistorySidebar from './_components/WatchHistorySidebar'
const Plyr = dynamic(() => import('plyr-react'), { ssr: false })

const getItemDetails = async (
  onedriveItemId: string,
  driveId: string,
  folderId: string,
  accountId: string,
  select?: string,
) => {
  try {
    const baseUrl = new URL(window.location.href)
    const requestUrl = new URL('/api/entertainment/item', baseUrl)
    requestUrl.searchParams.set('onedrive_item_id', onedriveItemId)
    requestUrl.searchParams.set('drive_id', driveId)
    requestUrl.searchParams.set('folder_id', folderId)
    requestUrl.searchParams.set('account_id', accountId)
    if (select) {
      requestUrl.searchParams.set('select', select)
    }

    const response = await fetch(requestUrl)
    const data = await response.json()

    // console.log('Onedrive data: ', data)
    return data
  } catch (error) {
    console.error(error)
  }
}

const VideoPlayer = ({
  videoUrl,
  width,
  height,
  information,
  startAt,
}: {
  videoUrl: string
  width?: number
  height?: number
  information: {
    onedrive_item_id: string
    entertainment_item_id: string
    tmdb_id: string
  }
  startAt: number
}) => {
  let firstTimePlaying = 2
  const [startInterval, setStartInterval] = useState(false)
  const [currentTime, setCurrentTime] = useState(startAt)

  // Common plyr configs, including the video source and plyr options
  // @ts-ignore
  const plyrSource = {
    type: 'video',
    title: 'Name',
    sources: [{ src: videoUrl }],
  }
  const plyrOptions: Plyr.Options = {
    ratio: `${width ?? 16}:${height ?? 9}`,
    fullscreen: { iosNative: true },
  }

  const videoPlayerRef = useCallback((node: APITypes) => {
    if (node) {
      if (node.plyr.source != null) {
        node.plyr.on('canplay', () => {
          if (firstTimePlaying > 0) {
            // console.log(`moving to ${startAt}`)
            node.plyr.forward(startAt)
            firstTimePlaying--
          } else {
            // console.log('Setting up Interval')
            setStartInterval(true)
            setCurrentTime(node.plyr?.currentTime)
          }
        })
        node.plyr.on('pause', () => {
          // console.log('Paused')
          setStartInterval(false)
        })
        node.plyr.on('waiting', () => {
          // console.log('waiting')
          setStartInterval(false)
        })
      }
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (startInterval) {
      interval = setInterval(() => {
        // console.log('Interval')
        fetch(`/api/entertainment/watch/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // timestamp, tmdb_id, onedrive_item_id, entertainment_item_id
          body: JSON.stringify({
            timestamp: currentTime,
            ...information,
          }),
        })

        setCurrentTime(currentTime + 5)
      }, 5 * 1000)
    }

    return () => {
      console.log('Clearing Interval')
      clearInterval(interval as NodeJS.Timeout)
    }
  }, [startInterval])

  const [importedComponent, setImportedComponent] =
    useState<ReactElement | null>(null)

  useEffect(() => {
    const importComponent = async () => {
      const myModule = await import('plyr-react')
      const Plyr = myModule.default
      setImportedComponent(
        <Plyr
          id="plyr"
          source={plyrSource as Plyr.SourceInfo}
          options={plyrOptions}
          ref={videoPlayerRef}
        />,
      )
    }

    importComponent()
  }, [])

  return <div>{importedComponent}</div>
}

const SecondVideoPlayer = ({
  videoUrl,
  startAt,
  information,
}: {
  videoUrl: string
  startAt: number
  information: {
    onedrive_item_id: string
    entertainment_item_id: string
    tmdb_id: string
  }
}) => {
  const videoPlayer = useRef<ReactPlayer>(null)
  const [firstTimePlaying, setFirstTimePlaying] = useState(true)

  const seekTo = (seconds: number) => {
    // console.log('Seeking to ', seconds)
    if (videoPlayer.current) {
      if (firstTimePlaying) {
        setFirstTimePlaying(false)
        videoPlayer.current.seekTo(seconds)
      }
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    interval = setInterval(() => {
      // console.log('Interval')
      fetch(`/api/entertainment/watch/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // timestamp, tmdb_id, onedrive_item_id, entertainment_item_id
        body: JSON.stringify({
          timestamp: videoPlayer.current?.getCurrentTime() ?? 0,
          ...information,
        }),
      })
    }, 5 * 1000)

    return () => {
      // console.log('Clearing Interval')
      clearInterval(interval as NodeJS.Timeout)
    }
  }, [])
  return (
    <ReactPlayer
      ref={videoPlayer}
      width={'100%'}
      height={'100%'}
      light
      url={videoUrl}
      playing={true}
      playsinline={true}
      onReady={() => {
        seekTo(startAt)
      }}
      controls
    />
  )
}

const PlayVideo = () => {
  const session = useSession()
  if (session.status === 'unauthenticated') {
    toast.error('You need to login to access this page', {
      duration: 5000,
      style: {
        backgroundColor: 'red',
      },
    })
    redirect('/login')
  }

  const searchParams = useSearchParams()
  const driveId = searchParams?.get('driveId')
  const onedriveItemId = searchParams?.get('onedriveItemId')
  const folderId = searchParams?.get('folderId')
  const accountId = searchParams?.get('accountId')
  const backdrop_url = searchParams?.get('backdrop_url')
  const entertainmentItemId = searchParams?.get('entertainmentItemId')
  const tmdbId = searchParams?.get('tmdbId')

  const [firstTimePlaying, setFirstTimePlaying] = useState(true)
  const [firstTimeStamp, setFirstTimeStamp] = useState(0)

  const [fetchMeAgain, setFetchMeAgain] = useState(false)
  const [currentTab, setCurrentTab] = useState('player1')

  const router = useRouter()

  const videoUrl = `/api/raw?onedrive_item_id=${onedriveItemId}&drive_id=${driveId}&folder_id=${folderId}&account_id=${accountId}`

  const [itemDetails, setItemDetails] = useState<{
    name: string
    webUrl: string
    '@microsoft.graph.downloadUrl': string
    file: {
      mimeType: string
    }
  }>()

  useEffect(() => {
    const fetchDetails = async () => {
      if (
        !onedriveItemId?.trim() ||
        !driveId?.trim() ||
        !folderId?.trim() ||
        !accountId?.trim()
      ) {
        console.error('some values are missing')
        return
      }

      const details = await getItemDetails(
        onedriveItemId,
        driveId,
        folderId,
        accountId,
      )
      setItemDetails(details.value)
    }
    fetchDetails()
  }, [driveId, onedriveItemId, folderId, accountId])

  useEffect(() => {
    if (firstTimePlaying) {
      const fetchTimestamp = async () => {
        // timestamp, tmdb_id, onedrive_item_id, entertainment_item_id
        const addItemIfNotExistResponse = await fetch(
          '/api/entertainment/watch/',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              onedrive_item_id: onedriveItemId,
              entertainment_item_id: entertainmentItemId,
              tmdb_id: tmdbId,
            }),
          },
        )

        const data = await addItemIfNotExistResponse.json()
        // console.log('Main Timestamp', data.data.timestamp)
        setFirstTimeStamp(data.data.timestamp)
      }

      const updateWatchHistory = async () => {
        const resposne = await fetch(`/api/watchHistory/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            onedrive_item_id: onedriveItemId,
            entertainment_item_id: entertainmentItemId,
            drive_id: driveId,
            account_id: accountId,
            folder_id: folderId,
            tmdb_id: tmdbId,
          }),
        })
      }

      fetchTimestamp()
      updateWatchHistory()
    }
  }, [fetchMeAgain])

  return (
    <div className="w-full">
      <div className="p-2 mx-auto">
        <div className="flex justify-start">
          <WatchHistorySidebar />
          <div className="flex flex-grow gap-2 mb-2 justify-center items-center">
            <Link
              href={'/home'}
              className="group hover:bg-gray-900 rounded-lg py-3 px-4 flex items-center w-max gap-2"
            >
              <Home className="w-6 h-6 mx-auto" color="white" />
              <p className="text-white text-sm group-hover:underline">Home</p>
            </Link>
            <Link
              href={`/home/view/${entertainmentItemId}`}
              className="group hover:bg-gray-900 rounded-lg py-2 px-4 flex items-center w-max gap-2"
            >
              <Video className="w-6 h-6 mx-auto" color="white" />
              <p className="text-white text-sm group-hover:underline">
                Go to movie
              </p>
            </Link>
          </div>
        </div>
        {itemDetails && (
          <>
            <div className="border-white rounded-sm">
              <Tabs
                onValueChange={(value) => {
                  setFetchMeAgain((prev) => !prev)
                  setCurrentTab(value)
                }}
                className="gap-1"
                defaultValue="player1"
              >
                <TabsList className="w-full bg-black mx-auto p-0 m-0">
                  <TabsTrigger value="player1">
                    <span
                      className={cn(
                        currentTab == 'player1'
                          ? 'text-black bg-white'
                          : 'text-white bg-black hover:bg-muted-foreground',
                        'px-3 py-1 rounded-lg',
                      )}
                    >
                      Player 1
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="player2">
                    <span
                      className={cn(
                        currentTab == 'player2'
                          ? 'text-black bg-white'
                          : 'text-white bg-black hover:bg-muted-foreground',
                        'px-3 py-1 rounded-lg',
                      )}
                    >
                      Player 2
                    </span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="player1">
                  <div className="border-4 border-white rounded-md w-[75%] mx-auto">
                    <VideoPlayer
                      videoUrl={videoUrl}
                      width={1920}
                      height={1080}
                      information={{
                        onedrive_item_id: onedriveItemId as string,
                        entertainment_item_id: entertainmentItemId as string,
                        tmdb_id: tmdbId as string,
                      }}
                      startAt={firstTimeStamp}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="player2">
                  <div className="border-4 border-white rounded-md w-[75%] mx-auto aspect-video">
                    <SecondVideoPlayer
                      videoUrl={videoUrl}
                      startAt={firstTimeStamp}
                      information={{
                        onedrive_item_id: onedriveItemId as string,
                        entertainment_item_id: entertainmentItemId as string,
                        tmdb_id: tmdbId as string,
                      }}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div className="flex flex-row gap-4 justify-center mt-4">
              <Button
                onClick={() => {
                  toast.success('Link Copied', {
                    duration: 2000,
                    style: {
                      backgroundColor: 'green',
                      color: 'white',
                    },
                  })
                  navigator.clipboard.writeText(
                    itemDetails!['@microsoft.graph.downloadUrl'],
                  )
                }}
              >
                Copy Download Link
              </Button>
              <Button
                onClick={() => {
                  router.push(itemDetails!['@microsoft.graph.downloadUrl'])
                }}
              >
                Download
              </Button>
            </div>
          </>
        )}
        {!itemDetails && (
          <div className="flex justify-center items-center h-[90vh]">
            <Loader2 className="animate-spin" size={100} color="white" />
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayVideo
