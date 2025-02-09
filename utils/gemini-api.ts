import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("AIzaSyBrSqyTb4A4x48_YciNL72YT37t0YrxD7E")

export async function generateContent(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error generating content:", error)
    throw error
  }
}

export async function analyzeImage(image: string, prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" })
    const result = await model.generateContent([prompt, image])
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error analyzing image:", error)
    throw error
  }
}

