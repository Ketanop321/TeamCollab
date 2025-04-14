"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-4 max-w-md">An unexpected error occurred. Our team has been notified.</p>
          {this.state.error && (
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4 overflow-auto max-w-full text-sm">
              {this.state.error.toString()}
            </pre>
          )}
          <Button onClick={() => (window.location.href = "/")}>Go back to home</Button>
        </div>
      )
    }

    return this.props.children
  }
}
