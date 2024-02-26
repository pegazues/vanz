import connectDB from '@/lib/mongoose'
import { cleanupEntertainmentItems } from '@/lib/utils'
import EntertainmentItem from '@/models/entertainmentItem.model'
import ParentFolder from '@/models/parentFolder.model'
import { handleError } from '@/utils/errorHandler'
import chalk from 'chalk'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

const graphDomain = 'https://graph.microsoft.com'
const graphEndpoint = `/v1.0/me/drive/root/search(q={search-query})`

export async function GET(request: Request) {
  try {
    await connectDB()
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const limit = Number(url.searchParams.get('limit')) || 10
    const select = url.searchParams.get('select') || ''

    const entertainmentItems = await EntertainmentItem.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .select(select.replace(/,/g, ' '))

    return NextResponse.json(
      {
        status: 'success',
        length: entertainmentItems.length,
        entertainmentItems,
      },
      { status: 200 },
    )
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    // Delete all records in EntertaimentItem
    await EntertainmentItem.deleteMany()
    const folders = await ParentFolder.find().populate('account')

    const driveData: Object[] = []

    for (const folder in folders) {
      console.log(
        chalk.yellow(`Processing folder ${folders[folder].folder_name}`),
      )
      const { account, folder_name, _id } = folders[folder]

      const { access_token } = account

      const modifiedGraphEndpoint = graphEndpoint.replace(
        '{search-query}',
        `'${encodeURIComponent(folder_name.replace(/'/g, "\\'"))}'`,
      )

      const url = new URL(modifiedGraphEndpoint, graphDomain)
      url.searchParams.append('$top', '1')
      url.searchParams.append('$select', 'id,name,weburl,parentreference')

      const graphResponse = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await graphResponse.json()

      if (!graphResponse.ok) {
        console.log(chalk.red('Error: '), data)
        console.log(chalk.blue('Folder: '), folder_name)
        continue
      }

      if (!data.value.length) {
        continue
      }

      // 1. get the item id, drive id, site id of folder
      const driveId = data.value[0].parentReference.driveId
      const itemId = data.value[0].id

      // 2. get the children of each folder

      let performNextRequest = true

      let childrenItemsRequestUrl = new URL(
        `v1.0/me/drives/${driveId}/items/${itemId}/children`,
        graphDomain,
      )

      do {
        const childrenItemsResponse = await fetch(
          childrenItemsRequestUrl.toString(),
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              'Content-Type': 'application/json',
            },
          },
        )

        const childrenItemsData = await childrenItemsResponse.json()

        const childrenItems = childrenItemsData.value

        const entertainmentItems = childrenItems.map((item: any) => {
          return {
            title: item.name,
            parent_folder: _id,
            parent_folder_onedrive_id: itemId,
            onedrive_item_id: item.id,
            account: account._id,
            webURL: item.webUrl,
            onedrive_id: item.parentReference.driveId,
            site_id: item.parentReference.siteId,
          }
        })

        console.log(
          chalk.red(
            `Found items in ${account.name}: ${entertainmentItems.length}`,
          ),
        )

        // 3. Store each children as entertainment item in the database
        await EntertainmentItem.insertMany(entertainmentItems)

        if (!childrenItemsData['@odata.nextLink']) {
          performNextRequest = false
          break
        }
        childrenItemsRequestUrl = childrenItemsData['@odata.nextLink']
      } while (performNextRequest)
    }

    return NextResponse.json({ status: 'success', driveData }, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB()

    // Delete all records in EntertaimentItem
    // await EntertainmentItem.deleteMany()

    // only keep top 10
    // const ids = await EntertainmentItem.find().select('_id').limit(10)
    // await EntertainmentItem.deleteMany({ _id: { $nin: ids } })

    // Delete all records with tmdb_id  = null
    await cleanupEntertainmentItems()

    return Response.json({ message: 'deleted!' }, { status: 200 })
  } catch (error) {
    return handleError(error)
  }
}
