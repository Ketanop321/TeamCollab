"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAppContext } from "@/components/app-provider"
import { Trophy, Star, Award } from "lucide-react"

export function Gamification() {
  const { teamMembers, tasks } = useAppContext()
  const [leaderboard, setLeaderboard] = useState<{ name: string; points: number }[]>([])

  useEffect(() => {
    // Calculate points based on completed tasks
    const completedTasks = tasks.filter((task) => task.status === "done")
    const pointsPerTask = 10

    const updatedLeaderboard = teamMembers.map((member) => ({
      name: member.name,
      points: member.points + completedTasks.filter((task) => task.assignee === member.name).length * pointsPerTask,
    }))

    setLeaderboard(updatedLeaderboard.sort((a, b) => b.points - a.points))
  }, [teamMembers, tasks])

  const getLevel = (points: number) => Math.floor(points / 100) + 1
  const getProgressToNextLevel = (points: number) => (points % 100) / 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboard.map((member, index) => (
            <div key={member.name} className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-8 text-center">
                {index === 0 && <Trophy className="h-6 w-6 text-yellow-500" />}
                {index === 1 && <Star className="h-6 w-6 text-gray-400" />}
                {index === 2 && <Award className="h-6 w-6 text-amber-600" />}
                {index > 2 && <span className="text-lg font-bold">{index + 1}</span>}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold">{member.name}</span>
                  <span className="text-sm text-muted-foreground">Level {getLevel(member.points)}</span>
                </div>
                <Progress value={getProgressToNextLevel(member.points) * 100} className="h-2" />
              </div>
              <div className="flex-shrink-0 w-16 text-right">
                <span className="font-bold">{member.points} pts</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
