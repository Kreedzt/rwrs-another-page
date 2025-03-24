# Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json files for dependency installation
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies with cache optimization
RUN corepack enable && \
    corepack prepare pnpm@latest --activate && \
    pnpm install --frozen-lockfile

# Copy the rest of the code
COPY . .

# Build the app
RUN pnpm build

# Production stage with Nginx
FROM nginx:alpine AS production

# Copy the built files to Nginx serve directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
