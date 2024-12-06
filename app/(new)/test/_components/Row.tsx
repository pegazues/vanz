'use client'
import useScreenWidth from '@/hooks/useScreenWidth'
import { cn } from '@/lib/utils'
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react'
import { set } from 'mongoose'
import Image from 'next/image'
import { FC, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Link from 'next/link'

type RowProps = {
  cardContents: CarouselCardContent[]
}

const Row: FC<RowProps> = ({ cardContents }) => {
  const [currentlyHover, setCurrentlyHover] = useState(-1)

  const carouselRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const itemsToShow = 5
  const totalItem = cardContents.length
  let totalSize = useScreenWidth() * 0.75

  // @ts-ignore
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return

    setIsDragging(true)
    setStartX(e.pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
  }

  // @ts-ignore
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return

    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = x - startX // Adjust scroll speed multiplier as needed
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const moveLeft = () => {
    if (!carouselRef.current) return

    gsap.to(carouselRef.current, {
      duration: 0.5,
      scrollLeft:
        carouselRef.current.scrollLeft - (totalSize / itemsToShow + 16),
    })
  }

  const moveRight = () => {
    if (!carouselRef.current) return

    gsap.to(carouselRef.current, {
      duration: 0.5,
      scrollLeft:
        carouselRef.current.scrollLeft + (totalSize / itemsToShow + 16),
    })
  }

  if (totalSize === 0) {
    return <></>
  }

  return (
    <div
      className={cn('w-full flex justify-center gap-4')}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
    >
      <div className="text-white flex items-center">
        <div className="group hover:cursor-pointer" onClick={moveLeft}>
          <ArrowBigLeft className="h-12 w-12 p-2 fill group-hover:fill-white group-hover:bg-gray-700 rounded-full" />
        </div>
      </div>
      <div
        className={cn(
          'flex gap-4 basis-full items-center overflow-x-auto cursor-grab active:cursor-grabbing no-scrollbar',
        )}
        style={{
          maxWidth: `${totalSize + itemsToShow * 16}px`,
        }}
        ref={carouselRef}
      >
        {Array.from({ length: totalItem }).map((_, index) => {
          return (
            <CarouselItem
              key={index}
              index={index}
              currentlyHover={currentlyHover}
              setCurrentlyHover={setCurrentlyHover}
              itemsToShow={itemsToShow}
              totalSize={totalSize}
              cardContent={cardContents[index]}
            />
          )
        })}
      </div>
      <div className="text-white flex items-center">
        <div className="group hover:cursor-pointer" onClick={moveRight}>
          <ArrowBigRight className="h-12 w-12 p-2 fill group-hover:fill-white group-hover:bg-gray-700 rounded-full" />
        </div>
      </div>
    </div>
  )
}

type CarouselCardContent = {
  title: string
  rating: number
  frontImage: string
  backImage: string
}

type CarouselProps = {
  index: number
  currentlyHover: number
  setCurrentlyHover: (value: SetStateAction<number>) => void
  itemsToShow: number
  totalSize: number
  cardContent: CarouselCardContent
}

const CarouselItem: FC<CarouselProps> = ({
  index,
  currentlyHover,
  setCurrentlyHover,
  itemsToShow,
  totalSize,
  cardContent,
}) => {
  const [hover, setHover] = useState(false)
  const [shouldShrink, setShouldShrink] = useState(false)
  const [positionX, setPositionX] = useState(0)

  useEffect(() => {
    // only run for the first item
    if (index != 0) return

    // if the user is hovering on a different item
    if (currentlyHover != -1) {
      if (currentlyHover !== index) {
        setShouldShrink(true)
      }
    }

    if (currentlyHover === -1) {
      setShouldShrink(false)
    }
  }, [currentlyHover, index])

  const width = shouldShrink
    ? '0'
    : (totalSize / itemsToShow) * (hover ? 2 : 1) + (hover ? 16 : 0)

  return (
    <div
      className={cn(
        'group flex-shrink-0 transition-all duration-500 select-none cursor-pointer relative',
      )}
      style={{
        width: `${width}px`,
        height: `${Math.floor(((totalSize / itemsToShow) * 10) / 7)}px`,
      }}
    >
      <div
        className={cn(
          'absolute top-0 opacity-100 h-full w-full group-hover:opacity-0 transition-opacity duration-300',
        )}
      >
        <img
          src={cardContent?.backImage}
          alt="Movie"
          width={450}
          height={600}
          onMouseEnter={(e) => {
            e.preventDefault()
            setCurrentlyHover(index)
            setHover(true)
          }}
          onMouseLeave={(e) => {
            setCurrentlyHover(-1)
            setHover(false)
          }}
          draggable={false}
          className={cn('rounded-lg transition-all w-full h-full object-cover')}
        />
      </div>
      <div
        className={cn(
          'absolute top-0 opacity-0 h-full w-full group-hover:opacity-100 transition-opacity duration-300',
        )}
      >
        <img
          src={cardContent?.frontImage}
          alt="Movie"
          width={600}
          height={450}
          onMouseEnter={(e) => {
            setCurrentlyHover(index)
            setHover(true)
          }}
          onMouseLeave={(e) => {
            setCurrentlyHover(-1)
            setHover(false)
          }}
          draggable={false}
          className={cn(
            'rounded-lg transition-all h-full w-full object-cover opacity-70',
          )}
        />
        <div className="absolute bottom-2 left-2 text-white">
          <h2 className="text-2xl">{cardContent?.title}</h2>
          <h4 className="text-sm font-bold">Rating {cardContent?.rating}/10</h4>
        </div>
      </div>
    </div>
  )
}

export default Row
