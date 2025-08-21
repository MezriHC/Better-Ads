# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Better Ads is a Next.js 15 application with authentication and project management. The platform provides a base structure for building AI-powered content generation features.

## Development Commands

```bash
# Development
npm run dev              # Start Next.js development server
npm run build            # Build for production  
npm run start            # Start production server
npm run lint             # Run ESLint

# Database (Prisma)
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes to database
npm run db:migrate       # Create and run migration
npm run db:deploy        # Deploy migrations (production)
npm run db:studio        # Open Prisma Studio
```

## Core Architecture

### Database Schema
- **Users**: NextAuth.js integration with Google OAuth
- **Projects**: Container for user's content and settings
- **Sessions/Accounts**: NextAuth.js authentication tables

### Core Services
- `src/app/_shared/database/client.ts`: Prisma client singleton
- `src/app/_shared/utils/api-helpers.ts`: API utilities (retry, validation, etc.)
- `src/app/_shared/utils/logger.ts`: Centralized logging system

### Authentication
Uses NextAuth.js with Google OAuth provider. Configuration in `src/app/_shared/lib/auth.ts:6-26`. Protected routes handled by `middleware.ts:250-291`.

### Frontend Architecture
- **Shared Components**: `src/app/_shared/` for reusable UI and business logic
- **Feature Pages**: `src/app/dashboard/` with modular component structure
- **Custom Hooks**: AI generation hooks in `src/app/_shared/hooks/`
- **Context**: Project context for state management

## Development Guidelines

### Environment Setup
- PostgreSQL database (can be remote for development)
- MinIO for local file storage
- FAL_KEY for AI service integration
- Google OAuth credentials for authentication

### Code Conventions
- Use custom CSS variables from `globals.css` instead of hardcoded colors
- Prefer `gap` over `space-*` utilities for element spacing  
- Always add `cursor-pointer` to interactive elements
- Follow the modular structure: feature-specific code in feature folders, shared code in `_shared`

### Error Handling
- Services use try/catch with detailed error messages
- Database operations include status tracking for async processes
- UI components handle loading and error states

### File Organization
- API routes follow Next.js 13+ App Router conventions
- Database queries organized by model in `_shared/database/queries/`
- Types shared across features in `_shared/types/`
- Feature-specific code contained within feature directories

## Testing and Quality

Run type checking and linting before commits:
```bash
npm run lint        # Check code quality
npm run build       # Verify build passes
```

The project uses TypeScript strict mode and ESLint for code quality.