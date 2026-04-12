import { useEffect, useState } from 'react'

function useFetch(url: string) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setData(data)
          setIsLoading(false)
        })
    })
  }, [url])
  return { data, isLoading }
}

export default useFetch
