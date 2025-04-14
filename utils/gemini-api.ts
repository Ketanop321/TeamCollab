/**
 * Client-side utility for AI features that calls our secure server API
 * instead of directly accessing the API key
 */

export async function generateContent(prompt: string): Promise<string> {
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, type: "text" }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error)
    }

    return data.text
  } catch (error) {
    console.error("Error generating content:", error)
    return "Sorry, I couldn't generate a response at this time. Please try again later."
  }
}

export async function analyzeImage(imageData: string, prompt: string): Promise<string> {
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        imageData,
        type: "image",
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error)
    }

    return data.text
  } catch (error) {
    console.error("Error analyzing image:", error)
    return "Sorry, I couldn't analyze the image at this time. Please try again later."
  }
}
