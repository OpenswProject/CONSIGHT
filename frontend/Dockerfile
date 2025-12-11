# Stage 1: Build the React application
FROM node:lts-alpine AS builder
WORKDIR /app

# Clean up previous build artifacts and node_modules to ensure a fresh start
RUN rm -rf node_modules dist

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Debugging: List contents to verify files are copied
RUN ls -la /app
RUN ls -la /app/src/pages

# Build the React application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output from the builder stage to Nginx's serving directory
COPY --from=builder /app/dist/ /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]