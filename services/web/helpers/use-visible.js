import { useState, useEffect, useRef } from 'react'

export default function useVisible(initialIsVisible) {
  const [isVisible, setVisible] = useState(initialIsVisible)
  const ref = useRef()

  const handleClickOutside = (event) => {
    if (event.target instanceof Node) {
      if (!ref.current?.contains(event.target)) {
        setVisible(false)
      }
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)

    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  return { isVisible, ref, setVisible }
}
