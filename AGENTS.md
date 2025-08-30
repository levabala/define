# Agent Guidelines

## Build/Test/Lint Commands

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run format` - Format code with Prettier
- `bun run migrate` - Generate and run database migrations
- No test command configured - check if tests exist before assuming test framework

## Code Style Guidelines

- **Formatting**: 4-space indentation, single quotes
- **Imports**: Use `@/*` path mapping for src imports, organize imports automatically
- **Types**: Strict TypeScript enabled
- **React**: Use function declarations, hooks pattern with Jotai for state, React 19 with react-jsx
- **Components**: Tailwind CSS with class-variance-authority for variants, Radix UI primitives
- **Database**: Drizzle ORM with SQLite, use schema exports for types
- **API**: tRPC for client-server communication
- **Commits**: Always check last 10 commit messages with `git log --oneline -10` to match existing style

## Deployment Process

When the user asks to "deploy":

1. Check what will be committed: `git status && git diff --no-ext-diff`
2. Selectively add relevant files (avoid adding unrelated changes)
3. Execute: `git commit -m "message" && npm version patch && git push --follow-tags`

the commands in 1. and 3. must be executed sequentially via &&

## Key Dependencies

- React 19, TypeScript, Vite, Tailwind CSS, Drizzle ORM, tRPC, Jotai, Fastify, Bun runtime
