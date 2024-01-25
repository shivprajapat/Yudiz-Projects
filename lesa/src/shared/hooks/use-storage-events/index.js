import { useEffect, useState } from 'react'

const useStorageEvents = () => {
  const [isAuthenticated, setIsAuthenticated] = useState()

  useEffect(() => {
    window.addEventListener('storage', handleChangeStorage)
    return () => window.removeEventListener('storage', handleChangeStorage)
  }, [])

  const handleChangeStorage = () => {
    if (localStorage.getItem('userId') && localStorage.getItem('userToken')) {
      isAuthenticated(true)
    } else setIsAuthenticated(false)
  }

  return { isAuthenticated, setIsAuthenticated }
}

export default useStorageEvents
