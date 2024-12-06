'use client'
import Image from 'next/image'
import { FC } from 'react'

type HeroSectionProps = {}

const HeroSection: FC<HeroSectionProps> = () => {
  return (
    <section className="relative h-[90vh] rounded-xl border-2 border-white select-none">
      <Image
        src={`https://picsum.photos/seed/${new Date().toISOString()}/1920/1080`}
        fill
        className="w-full h-full rounded-xl brightness-50"
        objectFit="cover"
        alt="Hero image"
      />
      <div className="absolute inset-0 flex flex-col items-start justify-end gap-8 m-8">
        <h1 className="text-white font-semibold text-7xl tracking-tight">
          Avengers
        </h1>
        <p className="text-white text-xl">
          There was an idea to bring together a group of remarkable people.
        </p>
      </div>
    </section>
  )
}

export default HeroSection
