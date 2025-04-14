"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppContext } from "@/components/app-provider"
import { useToast } from "@/components/ui/use-toast"
import { Upload, Download, Trash2 } from "lucide-react"

export function FileSharing() {
  const { files, setFiles, currentUser } = useAppContext()
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    // In a real application, you would upload the file to a server here
    // For this example, we'll simulate an upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newFile = {
      id: `file-${Date.now()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      uploadedBy: currentUser?.name || "Unknown",
      uploadedAt: new Date(),
    }

    setFiles((prevFiles) => [...prevFiles, newFile])
    setUploading(false)
    toast({
      title: "File Uploaded",
      description: `${file.name} has been successfully uploaded.`,
    })
  }

  const handleFileDelete = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId))
    toast({
      title: "File Deleted",
      description: "The file has been removed from the project.",
      variant: "destructive",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Sharing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input type="file" onChange={handleFileUpload} disabled={uploading} />
            <Button disabled={uploading}>
              {uploading ? "Uploading..." : <Upload className="mr-2 h-4 w-4" />}
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                <span>{file.name}</span>
                <div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={file.url} download>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleFileDelete(file.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
