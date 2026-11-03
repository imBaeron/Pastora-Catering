import { useState, useEffect } from 'react'

export default function useHash() {
  const read = () => location.hash.slice(1) || 'home'
  const [h, setH] = useState(read)
  useEffect(() => {
    const on = () => { setH(read()); window.scrollTo(0, 0) }
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])
  return h
}
