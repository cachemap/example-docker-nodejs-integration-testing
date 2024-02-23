# Step 1: Use the official Node.js image as a parent image
FROM node:18

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install the application's dependencies
RUN npm install

# Step 5: Copy the rest of the application's source files
COPY . .

# Step 6: Set the default container launch command to run the app
CMD [ "node", "/src/index.js" ]