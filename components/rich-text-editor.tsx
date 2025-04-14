"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [text, setText] = useState(value)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleChange = () => {
    if (editorRef.current) {
      const newValue = editorRef.current.innerHTML
      setText(newValue)
      onChange(newValue)
    }
  }

  const applyStyle = (style: string) => {
    document.execCommand(style, false)
    handleChange()
  }

  return (
    <div className="border rounded-md p-2">
      <div className="flex space-x-2 mb-2">
        <Button type="button" variant="outline" size="icon" onClick={() => applyStyle("bold")}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="icon" onClick={() => applyStyle("italic")}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="icon" onClick={() => applyStyle("underline")}>
          <Underline className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="icon" onClick={() => applyStyle("insertUnorderedList")}>
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="icon" onClick={() => applyStyle("insertOrderedList")}>
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="border p-2 min-h-[100px]"
        onInput={handleChange}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  )
}
