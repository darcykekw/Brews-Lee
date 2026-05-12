'use client'

import { useState, useRef, useCallback } from 'react'

interface UseImageUploadReturn {
  previewUrl: string | null
  file: File | null
  inputRef: React.RefObject<HTMLInputElement>
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  triggerFileInput: () => void
  resetImage: () => void
}

export function useImageUpload(): UseImageUploadReturn {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const objectUrlRef = useRef<string | null>(null)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    // Revoke previous object URL to avoid memory leaks
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)

    const url = URL.createObjectURL(selected)
    objectUrlRef.current = url
    setPreviewUrl(url)
    setFile(selected)
  }, [])

  const triggerFileInput = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const resetImage = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setPreviewUrl(null)
    setFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }, [])

  return { previewUrl, file, inputRef, handleFileChange, triggerFileInput, resetImage }
}
