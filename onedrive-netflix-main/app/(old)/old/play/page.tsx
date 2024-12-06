'use client'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

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

    return data.value
  } catch (error) {
    console.error(error)
  }
}

const PlayVideo = () => {
  const searchParams = useSearchParams()
  const driveId = searchParams?.get('driveId')
  const onedriveItemId = searchParams?.get('onedriveItemId')
  const folderId = searchParams?.get('folderId')
  const accountId = searchParams?.get('accountId')

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
      setItemDetails(details)
    }
    fetchDetails()
  }, [driveId, onedriveItemId, folderId, accountId])

  return (
    <>
      {itemDetails && itemDetails.name.split('.').pop() !== 'mkv' && (
        <video
          style={{
            position: 'absolute',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0',
            width: '100vw',
            height: '100vh',
            zIndex: '10',
          }}
          controls
          autoPlay={true}
        >
          <source src={videoUrl} type={itemDetails.file.mimeType} />
        </video>
      )}
      {itemDetails && itemDetails.name.split('.').pop() === 'mkv' && (
        <div className="flex align-middle justify-center items-center mt-20">
          <h2 className="text-xl">
            Cannot display <b>.mkv</b> files on web. Please download it from{' '}
          </h2>
          <Button
            variant={'default'}
            className="ml-4"
            onClick={() => {
              router.push(itemDetails['@microsoft.graph.downloadUrl'])
            }}
          >
            here
          </Button>
        </div>
      )}
    </>
  )
}

// PlayVideo

PlayVideo.getLayout = function getLayout(page: React.ReactNode) {
  return <>{page}</>
}

export default PlayVideo
