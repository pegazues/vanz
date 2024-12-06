'use client'

import { getList, getTitle } from '@/lib/helper'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { useIntersection } from '@mantine/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'

const filterTypes = ['movie', 'tv']
const filterLetters = 'abcdefghijklmnopqrstuvwxyz'.split('')

export default function ListPage() {
  const [filter, setFilter] = useState<{
    type: 'movie' | 'tv'
    letter: string
  }>({ type: 'movie', letter: 'a' })

  const { data, fetchNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['entertainment', filter],
    queryFn: ({ pageParam }) => getList(pageParam, filter),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.nextPage
    },
    initialPageParam: 0,
  })

  const items = data?.pages.flatMap((page) => page.data) || []

  const lastItemRef = useRef<HTMLElement>(null)

  const { ref, entry } = useIntersection({
    root: lastItemRef.current,
    threshold: 0.5,
  })

  if (entry?.isIntersecting) {
    fetchNextPage()
  }
  return (
    <div className="max-w-4xl mx-auto text-primary-foreground">
      <div className="flex flex-row w-full ">
        <Tabs
          onValueChange={(newValue) =>
            setFilter((prev) => ({ ...prev, type: newValue as 'movie' | 'tv' }))
          }
          defaultValue="movie"
          className="mx-auto"
        >
          <TabsList>
            <TabsTrigger className="text-black" value="movie">
              <span
                className={`text-${
                  filter.type === 'movie' ? 'white' : 'black'
                }`}
              >
                Movie
              </span>
            </TabsTrigger>
            <TabsTrigger className="text-black" value="tv">
              <span
                className={`text-${filter.type === 'tv' ? 'white' : 'black'}`}
              >
                TV
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-row gap-2 flex-wrap mb-4 mt-4">
        {filterLetters.map((letter) => (
          <Button
            key={letter}
            className={`${
              filter.letter === letter ? 'bg-zinc-900' : 'bg-black'
            }`}
            onClick={() => setFilter((prev) => ({ ...prev, letter }))}
          >
            <span className={`${filter.letter === letter ? 'font-bold' : ''}`}>
              {letter.toUpperCase()}
            </span>
          </Button>
        ))}
      </div>

      {isLoading && <Loader className="animate-spin color-white mx-auto" />}
      <div className="grid grid-cols-4 auto-rows-max gap-2">
        {!isLoading &&
          // @ts-ignore
          items.map((item, index) => (
            <div
              className="flex"
              ref={index === items.length - 1 ? ref : undefined}
              key={item._id}
            >
              <Link href={`/home/view/${item._id}`}>
                <div className="relative group cursor-pointer">
                  <img
                    className="rounded-md hover:brightness-[20%]"
                    src={
                      item.poster_image ||
                      `https://via.placeholder.com/300x450?text=${getTitle(
                        item.title,
                      )}`
                    }
                    alt={item.title}
                  />
                  <span className="hidden absolute bottom-2 text-center w-full left-2 text-white font-bold group-hover:flex">
                    {getTitle(item.title)}
                  </span>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </div>
  )
}
