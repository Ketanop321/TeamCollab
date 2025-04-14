import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const activities = [
  {
    user: { name: "John Doe", avatar: "JD" },
    action: "completed task",
    item: "Update landing page",
    time: "2 hours ago",
  },
  {
    user: { name: "Jane Smith", avatar: "JS" },
    action: "commented on",
    item: "Bug fix #123",
    time: "4 hours ago",
  },
  {
    user: { name: "Bob Johnson", avatar: "BJ" },
    action: "created project",
    item: "New Marketing Campaign",
    time: "1 day ago",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback>{activity.user.avatar}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">
              {activity.user.name} {activity.action} {activity.item}
            </p>
            <p className="text-sm text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
