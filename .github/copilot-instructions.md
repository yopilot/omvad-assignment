<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a full-stack Link Saver application built with:

## Tech Stack
- **Frontend**: Next.js 15 with React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with bcryptjs for password hashing
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Custom components with Lucide React icons
- **External API**: Jina AI for auto-summarization

## Architecture
- App Router with TypeScript
- Cookie-based JWT authentication
- Middleware for route protection
- Server-side API routes for CRUD operations
- Client-side React components with hooks
- Responsive design with mobile-first approach

## Key Features
- User registration and login with password hashing
- Bookmark creation with automatic metadata extraction
- AI-powered summary generation using Jina AI
- Tag-based filtering system
- Responsive grid layout for bookmarks
- Delete functionality with confirmation
- Dark mode toggle (partially implemented)

## Code Guidelines
- Use TypeScript for all new code
- Follow React best practices with hooks
- Use Tailwind CSS for styling
- Implement proper error handling
- Use Zod for data validation
- Keep components small and focused
- Use proper type definitions

## Database Schema
- Users: id, email, password, timestamps
- Bookmarks: id, url, title, favicon, summary, tags (JSON string), userId, timestamps
