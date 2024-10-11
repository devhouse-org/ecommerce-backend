# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

RUN npx prisma db push

# Build the NestJS application
RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install only production dependencies
COPY package*.json ./

# Clean npm cache and install only production dependencies
RUN npm install --production

# Copy the build output and Prisma files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Expose the application port
EXPOSE 3000

# Start the NestJS application
CMD ["node", "dist/main.js"]
