# Link Saver + Auto-Summary

A full-stack web application that allows users to save bookmarks with AI-powered summaries. Built for the Omvad internship take-home assignment.

## 🚀 Features

### Core Features (Must-have)
- ✅ **User Authentication**: Email/password registration and login with bcrypt password hashing
- ✅ **JWT Authentication**: Session management with HTTP-only cookies
- ✅ **Bookmark Management**: Save URLs with automatic metadata extraction (title, favicon)
- ✅ **AI Auto-Summary**: Integration with Jina AI's free API for content summarization
- ✅ **Responsive UI**: Mobile-first design with Tailwind CSS
- ✅ **Delete Functionality**: Remove bookmarks with confirmation
- ✅ **Database Storage**: SQLite with Prisma ORM for local persistence

### Nice-to-have Features (Implemented)
- ✅ **Tag System**: Add and filter bookmarks by tags
- ✅ **Dark Mode**: Toggle between light and dark themes
- ✅ **Responsive Grid**: Adaptive layout for different screen sizes
- ✅ **Error Handling**: Graceful error handling throughout the app
- ✅ **Loading States**: User feedback during async operations

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **State Management**: React hooks (useState, useEffect)

### Backend
- **API**: Next.js API routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with bcryptjs
- **External API**: Jina AI (r.jina.ai) for summarization

### DevOps & Testing
- **Testing**: Vitest with React Testing Library
- **Type Safety**: TypeScript throughout
- **Code Quality**: ESLint configuration
- **Database Migrations**: Prisma

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd link-saver
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up the database**
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate
```

4. **Environment setup**
The `.env` file is already configured with development defaults:
- SQLite database file
- JWT secret (change in production)
- Next.js configuration

5. **Start development server**
```bash
npm run dev
```

6. **Open your browser**
Visit [http://localhost:3000](http://localhost:3000)

## 📱 Usage

1. **Register/Login**: Create an account or sign in
2. **Add Bookmark**: Paste any URL in the form
3. **Add Tags**: Optionally add comma-separated tags
4. **View Summary**: AI-generated summary appears automatically
5. **Filter**: Use tag filters to organize bookmarks
6. **Delete**: Remove unwanted bookmarks

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Bookmark Endpoints
- `GET /api/bookmarks` - List user's bookmarks
- `POST /api/bookmarks` - Create new bookmark
- `DELETE /api/bookmarks/[id]` - Delete bookmark

## 🔧 Database Schema

### Users Table
- `id` - Unique identifier
- `email` - User email (unique)
- `password` - Hashed password
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

### Bookmarks Table
- `id` - Unique identifier
- `url` - Bookmark URL
- `title` - Page title (auto-extracted)
- `favicon` - Site favicon URL
- `summary` - AI-generated summary
- `tags` - JSON array of tags
- `userId` - Foreign key to users
- `createdAt` - Bookmark creation timestamp
- `updatedAt` - Last update timestamp

## 🎨 Screenshots

### Authentication Page
- Clean, centered login/register form
- Input validation with error messages
- Responsive design for mobile and desktop

### Dashboard
- Header with logo and logout functionality
- Add bookmark form with URL and tags input
- Tag filter system
- Responsive bookmark grid
- Each bookmark card shows favicon, title, summary, and tags

### Bookmark Cards
- Favicon and domain display
- Truncated title and summary
- Tag badges with icons
- Delete button with confirmation
- External link to original URL
- Creation date

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
1. Push to GitHub
2. Connect repository to Vercel
3. Deploy with default settings
4. Vercel will handle Next.js deployment automatically

### Environment Variables for Production
Update these in your deployment platform:
- `JWT_SECRET` - Strong secret key for JWT signing
- `DATABASE_URL` - Production database connection string

## ⏱ Time Investment

**Total time spent**: ~4.5 hours

### Breakdown:
- **Setup & Architecture** (45 min): Project scaffolding, dependencies, database setup
- **Authentication System** (60 min): JWT implementation, middleware, auth pages
- **Core Features** (90 min): Bookmark CRUD, metadata extraction, Jina AI integration  
- **UI/UX Development** (75 min): Component design, responsive layout, styling
- **Testing & Polish** (30 min): Test setup, error handling, documentation

## 🔮 What I'd Do Next

### Immediate Improvements (Week 1)
- **Enhanced Testing**: Increase test coverage to 90%+
- **Performance**: Implement virtual scrolling for large bookmark collections
- **Accessibility**: Add ARIA labels, keyboard navigation, screen reader support
- **Error Boundaries**: React error boundaries for better error handling

### Feature Additions (Month 1)
- **Search Functionality**: Full-text search across titles and summaries
- **Bookmark Collections**: Organize bookmarks into folders/collections
- **Import/Export**: Support for browser bookmark imports
- **Sharing**: Share bookmark collections with other users
- **Bulk Operations**: Select and manage multiple bookmarks

### Advanced Features (Quarter 1)
- **Real-time Sync**: WebSocket for real-time updates across devices
- **Browser Extension**: Chrome/Firefox extension for quick bookmarking
- **Social Features**: Public bookmark collections, following users
- **Analytics**: Bookmark usage analytics and insights
- **ML Improvements**: Better summarization, auto-tagging based on content

### Technical Debt & Scaling
- **Database Migration**: Move to PostgreSQL for production
- **Caching Layer**: Redis for session management and API caching
- **Rate Limiting**: Implement rate limiting for API endpoints
- **CDN Integration**: Serve static assets via CDN
- **Monitoring**: Add application monitoring and logging

## 📄 License

This project is built for the Omvad internship assignment.

## 🙏 Acknowledgments

- **Jina AI** for providing free summarization API
- **Next.js** for the excellent full-stack framework
- **Prisma** for the fantastic database toolkit
- **Tailwind CSS** for rapid UI development
