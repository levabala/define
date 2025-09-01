FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY src src
COPY public public
COPY tsconfig.json tsconfig.json
COPY vite.config.ts vite.config.ts

# Set build arguments and environment variables for Datadog
ARG VITE_DATADOG_APPLICATION_ID
ARG VITE_DATADOG_CLIENT_TOKEN

# Validate required Datadog environment variables
RUN test -n "$VITE_DATADOG_APPLICATION_ID" || (echo "ERROR: VITE_DATADOG_APPLICATION_ID build argument is required" && exit 1)
RUN test -n "$VITE_DATADOG_CLIENT_TOKEN" || (echo "ERROR: VITE_DATADOG_CLIENT_TOKEN build argument is required" && exit 1)

ENV VITE_DATADOG_APPLICATION_ID=$VITE_DATADOG_APPLICATION_ID
ENV VITE_DATADOG_CLIENT_TOKEN=$VITE_DATADOG_CLIENT_TOKEN

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
