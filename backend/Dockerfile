FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY src ./src
COPY tests ./tests
COPY .env* ./

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "run", "dev"]
