import { useState, useEffect } from "react"

export function useSSE(url: string) {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const eventSource = new EventSource(url)

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data)
      setData(parsedData)
    }

    return () => {
      eventSource.close()
    }
  }, [url])

  return data
}
