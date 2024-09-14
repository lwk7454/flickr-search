import { useRef, useEffect, useMemo } from 'react'
import { debounce } from 'lodash'

export const useDebounce = (callback: (...args: any[]) => void) => {
  const ref = useRef<(...args: any[]) => void>()

  useEffect(() => {
    ref.current = callback
  }, [callback])

  const debouncedCallback = useMemo(() => {
    const func = (...args: any[]) => {
      ref.current?.(...args)
    }

    return debounce(func, 500)
  }, [])

  return debouncedCallback
}