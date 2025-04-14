import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const teamMembers = [
  { name: "John Doe", role: "Project Manager", avatar: "JD" },
  { name: "Jane Smith", role: "Developer", avatar: "JS" },
  { name: "Bob Johnson", role: "Designer", avatar: "BJ" },
  { name: "Alice Williams", role: "Marketing", avatar: "AW" },
]

export function TeamMembers() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {teamMembers.map((member, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback>{member.avatar}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{member.name}</p>
            <p className="text-sm text-muted-foreground">{member.role}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
