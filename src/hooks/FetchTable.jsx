import { useEffect, useState } from "react"

export const FetchTable = url => {
    const [data, setData] = useState(null)
  
    useEffect(() => {
      fetch(url)
        .then(res => {
          if (res.ok) {
            return res.json()
          } else {
            throw new Error('Error fetching data')
          }
        })
        .then(data => {
          setData(data)
        })
    }, [url])
  
    return { data }
  }