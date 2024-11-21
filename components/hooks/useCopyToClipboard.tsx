import { useCallback, useState } from "react"

export const useCopyToClipboard = () => {
  const [state, setState] = useState()

  const copyToClipBoard = useCallback((value) => {
    const handleCopy = async () => {
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(value)
          setState(value)
        } else {
          throw new Error('writeText not supported')
        }
      } catch (e) {
        throw new Error('failed to copy text')
      }
    }
    handleCopy();
  }, [])
  return [state, copyToClipBoard]
}