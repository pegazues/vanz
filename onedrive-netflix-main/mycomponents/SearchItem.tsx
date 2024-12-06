import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TMDB_IMAGE_DOMAIN } from '@/lib/utils'
import { Loader, Loader2, Search } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function SearchItem({ language }: { language: string }) {
  const [searchItems, setSearchItems] = useState<any>([])
  const [searchInput, setSearchInput] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchInput.length > 0) {
        setLoading(true)
        // wait for 5 seconds to mock loading
        // await new Promise((resolve) => setTimeout(resolve, 5000))
        const res = await fetch(
          `/api/entertainment/search?query=${searchInput}&language=${language}&limit=20`,
        )
        const data = await res.json()
        console.log(data)
        setSearchItems(data.data)
        setLoading(false)
      }
    }, 300)

    return () => {
      clearTimeout(delayDebounceFn)
    }
  }, [searchInput])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Search className="w-5 h-5 text-gray-300 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="border-none">
        <div>
          <Input
            className="text-white w-full"
            type="text"
            placeholder="Search..."
            onChange={(e) => {
              setSearchInput(e.target.value)
            }}
          />
          <ScrollArea className={`h-[300px]`}>
            {loading && (
              <Card className="text-white bg-transparent border-none w-full mt-6 flex justify-center items-center">
                <p>
                  <Loader2 className="w-10 h-10 animate-spin" />
                </p>
              </Card>
            )}

            <div className="flex flex-col mt-6">
              {!loading &&
                searchItems.length > 0 &&
                searchItems.map((item: any, idx: number) => (
                  <Link
                    href={`/home/view/${item._id}`}
                    key={idx}
                    className="bg-transparent hover:bg-gray-800 p-2 rounded-lg"
                    onClick={() => setOpen(false)}
                  >
                    <div className="flex">
                      <img
                        className="h-20 rounded-lg object-fill"
                        src={
                          item.cover
                            ? TMDB_IMAGE_DOMAIN + item.cover
                            : `https://api.dicebear.com/7.x/lorelei/svg?seed=${item.title}&r=50&b=50`
                        }
                        alt={'oh no'}
                      />
                      <div className="ml-4 flex flex-col justify-between h-full">
                        <p className="text-white text-xl font-semibold">
                          {item.translations[language].name.substring(0, 30) +
                            (item.translations[language].name.length > 30
                              ? '...'
                              : '')}
                        </p>
                        <p className="text-yellow-600">{item.rating}</p>
                        <p className="text-white">{item.genre.join(', ')}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              {!loading && searchItems.length === 0 && searchInput !== '' && (
                <Card className="text-white bg-transparent border-none">
                  <p>No results found!</p>
                </Card>
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="items-end">
          <DialogClose>
            <Button variant={'destructive'}>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
