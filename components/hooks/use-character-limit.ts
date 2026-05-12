'use client'

import { useState, useCallback } from 'react'

interface UseCharacterLimitOptions {
  maxLength: number
  initialValue?: string
}

export function useCharacterLimit({ maxLength, initialValue = '' }: UseCharacterLimitOptions) {
  const [value, setValue] = useState(initialValue)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const next = e.target.value
      if (next.length <= maxLength) setValue(next)
    },
    [maxLength]
  )

  return {
    value,
    setValue,
    characterCount: value.length,
    remaining: maxLength - value.length,
    isAtLimit: value.length >= maxLength,
    handleChange,
  }
}
