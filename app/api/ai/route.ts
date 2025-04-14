import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Add timeout for serverless functions
const TIMEOUT_DURATION = 25000 // 25 seconds (Vercel has 30s limit)

export async function POST(request: Request) {
  // Create a timeout promise
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Request timeout"))
    }, TIMEOUT_DURATION)
  })

  try {
    const { prompt, type = "text" } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Access the API key from server-side environment variable
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      console.warn("Missing Gemini API key. Using mock responses.")
      return NextResponse.json({ text: getMockResponse(prompt, type) })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Race between the actual request and the timeout
    const result = (await Promise.race([model.generateContent(prompt), timeoutPromise])) as any

    const response = await result.response

    return NextResponse.json({ text: response.text() })
  } catch (error: any) {
    console.error("Error generating AI content:", error)

    // Handle specific error types
    if (error.message === "Request timeout") {
      return NextResponse.json(
        {
          error: "The request took too long to process. Please try with a shorter prompt.",
        },
        { status: 504 },
      )
    }

    if (error.name === "AbortError") {
      return NextResponse.json(
        {
          error: "The request was aborted. Please try again.",
        },
        { status: 499 },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to generate content. Please try again later.",
      },
      { status: 500 },
    )
  }
}

function getMockResponse(prompt: string, type: string): string {
  if (type === "image") {
    return "This is a mock image analysis response. In production, this would analyze the provided image."
  }

  const responses = {
    task: "Based on the current tasks and team members, I recommend assigning the high-priority tasks to team members with fewer current assignments. Consider setting deadlines that account for team members' existing workloads.",
    meeting:
      "Meeting Summary:\n\n- Key Points: Discussed project timeline and resource allocation\n- Action Items: Team to complete task assignments by Friday\n- Project Updates: Website redesign is 65% complete, mobile app development is 30% complete",
    report:
      "Weekly Report:\n\n1. Overall Project Performance: Good progress on Website Redesign (65%)\n2. Team Productivity: 3 tasks completed this week\n3. Key Achievements: Design approval milestone reached\n4. Potential Risks: Mobile app development slightly behind schedule\n5. Recommendations: Consider allocating additional resources to mobile app development",
  }

  if (prompt.toLowerCase().includes("task")) return responses.task
  if (prompt.toLowerCase().includes("meeting")) return responses.meeting
  return responses.report
}
