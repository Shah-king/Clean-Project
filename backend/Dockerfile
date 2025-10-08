# Build Stage
FROM node:18 AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Final Stage
FROM node:18-slim
WORKDIR /app

# Copy compiled app from build stage
COPY --from=build /app /app

# Expose the port your app runs on
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
