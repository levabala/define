FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY src src
COPY public public
COPY favicon.ico favicon.ico
COPY tsconfig.json tsconfig.json
COPY vite.config.ts vite.config.ts

# Build the application
RUN bun run build

# Create data directory for SQLite
RUN mkdir -p /app/data

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV DB_ROOT_DIR=/app/data

# Start the application
# CMD ["cat", "/app/client/dist/vite.config.json"]
# CMD ["ls", "-Rlh", "--ignore=node_modules"]
CMD ["bun", "-b", "run", "src/server.ts"]
