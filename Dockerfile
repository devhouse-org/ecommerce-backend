# Step 1: Use an official Node runtime as a parent image
FROM node:20

# Step 2: Set the working directory in the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code to the working directory
COPY . .

# Step 7: Generate Prisma client
RUN npx prisma generate

# Step 9: Build the NestJS application
RUN npm run build

# Step 10: Expose the port the app runs on
EXPOSE 3000

# Step 11: Define the command to run the app
CMD ["npm", "run", "start:prod"]
