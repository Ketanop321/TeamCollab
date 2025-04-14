import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import clientPromise from "@/utils/mongodb"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400 })
    }

    if (!email.includes("@") || !email.includes(".")) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    // For development, we can use a mock response if MongoDB isn't set up
    if (!process.env.MONGODB_URI) {
      console.warn("MongoDB URI not found. Using mock response for development.")
      return NextResponse.json({ message: "User registered successfully (mock)" }, { status: 201 })
    }

    try {
      // Connect to MongoDB with timeout
      const client = (await Promise.race([
        clientPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error("Database connection timeout")), 5000)),
      ])) as any

      const db = client.db("teamcollab")

      // Check if user already exists
      const existingUser = await db.collection("users").findOne({ email })
      if (existingUser) {
        return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
      }

      // Hash password
      const hashedPassword = await hash(password, 10)

      // Create user
      const result = await db.collection("users").insertOne({
        name,
        email,
        password: hashedPassword,
        createdAt: new Date(),
      })

      return NextResponse.json({ message: "User registered successfully", userId: result.insertedId }, { status: 201 })
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ message: "Database connection failed. Please try again later." }, { status: 503 })
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 })
  }
}
