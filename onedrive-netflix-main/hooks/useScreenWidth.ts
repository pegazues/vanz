import { useEffect, useState } from 'react'

const useScreenWidth = () => {
  const [screenWidth, setScreenWidth] = useState(0)

  useEffect(() => {
    const handleResize = () =>
      setScreenWidth(document.documentElement.clientWidth)
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return screenWidth
}

export default useScreenWidth
