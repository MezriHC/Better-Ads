# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Build production application
npm start           # Start production server
npm run lint        # Run ESLint
```

### Database (Prisma + PostgreSQL)
```bash
npm run db:generate  # Generate Prisma client types
npm run db:push     # Push schema changes to database
npm run db:migrate  # Create and run migrations
npm run db:studio   # Open Prisma Studio on localhost:5555
```

### Docker
```bash
npm run docker:up    # Start PostgreSQL + pgAdmin containers
npm run docker:down  # Stop containers
npm run docker:reset # Reset containers with fresh data
```

## Architecture Overview

### Core Stack
- **Next.js 15.4.5** with App Router
- **TypeScript** with strict configuration
- **Prisma ORM** with PostgreSQL database
- **NextAuth.js** for authentication (Google OAuth)
- **Tailwind CSS** for styling with custom color system
- **MinIO** for S3-compatible file storage
- **fal.ai** for AI image/video generation

### Project Structure
The codebase follows a modular architecture with clear separation:

```
src/app/
├── _shared/           # Shared utilities across the application
│   ├── components/    # Reusable UI components
│   ├── hooks/        # Global React hooks
│   ├── lib/          # Utility functions and configurations
│   ├── services/     # External service integrations (MinIO, etc.)
│   ├── database/     # Prisma client and query utilities
│   └── types/        # Shared TypeScript types
├── api/              # All API routes
│   ├── auth/         # NextAuth authentication
│   ├── ai/           # AI generation endpoints (fal.ai integration)
│   ├── minio/        # File storage operations
│   └── projects/     # Project management
├── dashboard/        # Main application dashboard
│   └── create/       # Video creation interface
├── admin/            # Admin panel
└── login/            # Authentication page
```

### Key Architectural Patterns

**Authentication Flow:**
- NextAuth.js with Google OAuth provider
- Session management with Prisma adapter
- Protected routes via middleware.ts
- Client-side auth state via SessionProvider

**File Storage Architecture:**
- MinIO S3-compatible storage with structured buckets:
  - `avatars/public/` - Public avatar assets
  - `avatars/private/{userId}/` - User-specific avatars
  - `videos/generated/{userId}/{projectId}/` - Project-specific generated videos
- Centralized MinIOService class for all storage operations
- Atomic transactions for database + storage consistency

**AI Integration:**
- fal.ai for image generation (FLUX model) and video generation (Seedance)
- ElevenLabs for text-to-speech
- Retry logic with exponential backoff for API reliability
- 10-minute timeout for video generation processes

**Database Design:**
- Project-based organization: Users → Projects → Avatars/Videos
- Tag system for avatar categorization (age, genre, theme)
- Status tracking for async operations (processing, ready, failed)
- Cascading deletions for data integrity

### Critical Development Rules

**Code Quality:**
- NEVER add console.log statements or comments unless explicitly requested
- Use TypeScript strict mode - all types must be properly defined
- Follow the existing code style and component patterns

**Styling:**
- Use custom CSS variables from globals.css (supports automatic dark mode)
- Prefer `gap` for spacing over margins between elements
- Always add `cursor-pointer` to clickable elements
- Use Tailwind classes like `bg-background`, `text-foreground`, `border-border`

**Database Operations:**
- Always use transactions for operations involving multiple tables
- Project-scope all user data (videos, avatars must belong to specific projects)
- Use the centralized Prisma client from `_shared/database/client.ts`

**File Storage:**
- Use MinIOService for all storage operations
- Follow the bucket structure defined in plan.md
- Clean up failed uploads in catch blocks
- Generate consistent file URLs using the service

### Environment Configuration

Required environment variables:
```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# MinIO Storage
MINIO_ENDPOINT="85.215.140.65"
MINIO_PORT="9000"
MINIO_USE_SSL="false"
MINIO_ACCESS_KEY="..."
MINIO_SECRET_KEY="..."
MINIO_BUCKET_NAME="mini-prod-media"

# AI Services
FAL_KEY="..."
ELEVENLABS_API_KEY="..."
```

### Path Aliases
The project uses TypeScript path mapping:
- `@/*` - Root directory
- `@/src/app/_shared/*` - Shared utilities
- `@/components/*` - Shared components
- `@/lib/*` - Shared libraries
- `@/hooks/*` - Shared hooks

### Testing and Validation
- Always run `npm run build` to validate TypeScript compilation
- Use Prisma Studio (`npm run db:studio`) to inspect database state
- MinIO admin interface available for storage debugging
- Check middleware.ts for route protection logic

### Common Integration Points
- Video generation flow: User input → fal.ai API → MinIO storage → Database record
- Authentication state: NextAuth session → useAuth hook → UI components
- Project context: ProjectProvider → useProjects hook → component state
- File operations: Component → API route → MinIOService → Storage