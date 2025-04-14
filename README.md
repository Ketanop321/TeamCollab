# TeamCollab Platform

TeamCollab is a comprehensive team collaboration platform built with Next.js, React, and various cutting-edge technologies. This README provides instructions on how to set up and run the project.

## Features

- 🔐 User authentication (login, signup, profile management)
- 📊 Dashboard with project analytics
- ✅ Task management with Kanban board
- 📅 Calendar for scheduling
- 💬 Team messaging
- 📁 File sharing
- 👥 Team management
- 📈 Analytics and reporting
- 🤖 AI-powered features (task recommendations, meeting summarization, chatbot)

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MongoDB (optional for development)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MONGODB_URI=your-mongodb-connection-string
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
GEMINI_API_KEY=your-gemini-api-key
\`\`\`

## Installation

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/teamcollab-platform.git
cd teamcollab-platform
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Mode

In development mode, the application uses mock data and doesn't require authentication. This makes it easier to develop and test features without setting up a database or authentication providers.

## Deploying to Vercel

### Option 1: Deploy with Vercel CLI

1. Install Vercel CLI:
\`\`\`bash
npm install -g vercel
\`\`\`

2. Login to Vercel:
\`\`\`bash
vercel login
\`\`\`

3. Deploy the project:
\`\`\`bash
vercel
\`\`\`

4. For production deployment:
\`\`\`bash
vercel --prod
\`\`\`

### Option 2: Deploy from GitHub

1. Push your code to a GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: next build
   - Output Directory: .next
6. Add Environment Variables:
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   - MONGODB_URI
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL (set to your Vercel deployment URL)
   - GEMINI_API_KEY
7. Click "Deploy"

### Post-Deployment Verification

After deploying to Vercel, verify the following:

1. Authentication flow works correctly
2. Database connections are established
3. AI features are functioning
4. All pages load correctly
5. No console errors are present

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **AI Features**: Google Gemini API
- **Charts**: Recharts, React Google Charts
- **State Management**: React Context API

## Project Structure

- `/app`: Next.js App Router pages and layouts
- `/components`: Reusable React components
- `/utils`: Utility functions
- `/hooks`: Custom React hooks
- `/lib`: Library code
- `/public`: Static assets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
