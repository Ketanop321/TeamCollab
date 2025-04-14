"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppContext } from "@/components/app-provider"
import { useToast } from "@/components/ui/use-toast"
import { Shield, UserPlus, UserMinus } from "lucide-react"

export function RoleBasedAccess() {
  const { teamMembers, setTeamMembers, currentUser } = useAppContext()
  const [selectedMember, setSelectedMember] = useState<string | undefined>(undefined)
  const [selectedPermission, setSelectedPermission] = useState<string | undefined>(undefined)
  const { toast } = useToast()

  const handleAddPermission = () => {
    if (!selectedMember || !selectedPermission) return

    setTeamMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === Number.parseInt(selectedMember)
          ? { ...member, permissions: [...member.permissions, selectedPermission] }
          : member,
      ),
    )

    toast({
      title: "Permission Added",
      description: `${selectedPermission} permission has been added to the selected team member.`,
    })
  }

  const handleRemovePermission = () => {
    if (!selectedMember || !selectedPermission) return

    setTeamMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === Number.parseInt(selectedMember)
          ? { ...member, permissions: member.permissions.filter((p) => p !== selectedPermission) }
          : member,
      ),
    )

    toast({
      title: "Permission Removed",
      description: `${selectedPermission} permission has been removed from the selected team member.`,
    })
  }

  const allPermissions = [
    "create_project",
    "assign_tasks",
    "view_reports",
    "upload_files",
    "comment",
    "commit_code",
    "create_tasks",
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role-Based Access Control</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select onValueChange={setSelectedMember}>
            <SelectTrigger>
              <SelectValue placeholder="Select team member" />
            </SelectTrigger>
            <SelectContent>
              {teamMembers.map((member) => (
                <SelectItem key={member.id} value={member.id.toString()}>
                  {member.name} ({member.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setSelectedPermission}>
            <SelectTrigger>
              <SelectValue placeholder="Select permission" />
            </SelectTrigger>
            <SelectContent>
              {allPermissions.map((permission) => (
                <SelectItem key={permission} value={permission}>
                  {permission}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex space-x-2">
            <Button onClick={handleAddPermission} disabled={!selectedMember || !selectedPermission}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Permission
            </Button>
            <Button onClick={handleRemovePermission} disabled={!selectedMember || !selectedPermission}>
              <UserMinus className="mr-2 h-4 w-4" />
              Remove Permission
            </Button>
          </div>

          {selectedMember && (
            <div>
              <h3 className="font-semibold mb-2">Current Permissions:</h3>
              <ul>
                {teamMembers
                  .find((member) => member.id === Number.parseInt(selectedMember))
                  ?.permissions.map((permission) => (
                    <li key={permission} className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      {permission}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
