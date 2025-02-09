"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react"

export function RichTextEditor({ value, onChange }) {
  const [text, setText] = useState(value)

  const handleChange = (e) => {
    setText(e.target.value)
    onChange(e.target.value)
  }

  const applyStyle = (style) => {
    document.execCommand(style, false, null)
  }

  return (
    <div className="border rounded-md p-2">
      <div className="flex space-x-2 mb-2">
        <Button variant="outline" size="icon" onClick={() => applyStyle("bold")}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => applyStyle("italic")}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => applyStyle("underline")}>
          <Underline className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => applyStyle("insertUnorderedList")}>
          <List className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => applyStyle("insertOrderedList")}>
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      <div
        contentEditable
        className="border p-2 min-h-[100px]"
        onInput={handleChange}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  )
}

