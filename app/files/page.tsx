"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Folder, File, Upload, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function FilesPage() {
  const [files, setFiles] = useState([])
  const [folders, setFolders] = useState([])
  const [newFolderName, setNewFolderName] = useState("")
  const { toast } = useToast()

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files)
    setFiles([...files, ...uploadedFiles])
    toast({
      title: "Files Uploaded",
      description: `${uploadedFiles.length} file(s) have been uploaded`,
    })
  }

  const createFolder = () => {
    if (newFolderName.trim() !== "") {
      setFolders([...folders, newFolderName])
      setNewFolderName("")
      toast({
        title: "Folder Created",
        description: `Folder "${newFolderName}" has been created`,
      })
    }
  }

  const deleteFile = (index) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
    toast({
      title: "File Deleted",
      description: "The file has been removed",
      variant: "destructive",
    })
  }

  const deleteFolder = (index) => {
    const newFolders = [...folders]
    newFolders.splice(index, 1)
    setFolders(newFolders)
    toast({
      title: "Folder Deleted",
      description: "The folder has been removed",
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">File Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" onChange={handleFileUpload} multiple />
            </label>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Create Folder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Folder Name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <Button onClick={createFolder}>Create Folder</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Files and Folders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {folders.map((folder, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                <div className="flex items-center">
                  <Folder className="mr-2 h-5 w-5" />
                  <span>{folder}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteFolder(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                <div className="flex items-center">
                  <File className="mr-2 h-5 w-5" />
                  <span>{file.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteFile(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
