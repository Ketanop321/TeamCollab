import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentActivity } from "@/components/recent-activity"
import { TeamMembers } from "@/components/team-members"
import { AITaskRecommendations } from "@/components/ai-task-recommendations"
import { SmartMeetingSummarization } from "@/components/smart-meeting-summarization"
import { AIChatbot } from "@/components/ai-chatbot"
import { AIReportsInsights } from "@/components/ai-reports-insights"
import { FileSharing } from "@/components/file-sharing"
import { DiscussionThreads } from "@/components/discussion-threads"
import { RoleBasedAccess } from "@/components/role-based-access"
import { CustomizableReminders } from "@/components/customizable-reminders"
import { TimeTracking } from "@/components/time-tracking"
import { AutomatedWorkflows } from "@/components/automated-workflows"
import { Gamification } from "@/components/gamification"
import { AdvancedSearch } from "@/components/advanced-search"

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        TeamCollaboration Dashboard
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Total Projects</CardTitle>
            <CardDescription>Active and completed projects</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Tasks Due Soon</CardTitle>
            <CardDescription>Tasks due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">8</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Team Productivity</CardTitle>
            <CardDescription>Average tasks completed per week</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">24</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview />
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <AITaskRecommendations />
        <SmartMeetingSummarization />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <AIChatbot />
        <AIReportsInsights />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <FileSharing />
        <DiscussionThreads />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <RoleBasedAccess />
        <CustomizableReminders />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <TimeTracking />
        <AutomatedWorkflows />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Gamification />
        <AdvancedSearch />
      </div>
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <TeamMembers />
        </CardContent>
      </Card>
    </div>
  )
}
