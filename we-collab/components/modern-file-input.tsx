'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ModernFileInputProps {
  id: string
  accept?: string
  onChange: (file: File | null) => void
}

export function ModernFileInput({ id, accept, onChange }: ModernFileInputProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFileName(file?.name || null)
    onChange(file)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="file"
        id={id}
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      <Button type="button" onClick={handleButtonClick}>
        Choose File
      </Button>
      <span className="text-sm text-gray-500">
        {fileName || 'No file chosen'}
      </span>
    </div>
  )
}

