import { FC } from 'react'
import HeroSection from './_components/Hero'
import MainPage from './_components/MainPage'

type NewHomePageProps = {}

const NewHomePage: FC<NewHomePageProps> = () => {
  return (
    <div className="flex flex-col gap-4 m-8">
      <HeroSection />
      <MainPage />
      <div className="h-screen"></div>
    </div>
  )
}

export default NewHomePage
