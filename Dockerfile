# Stage 1: Build the application with Node.js v22
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Copy package files and tsconfig, then install dependencies
COPY package*.json tsconfig.json ./
RUN npm install

# Copy the rest of your source code and compile TypeScript files
COPY . .
RUN npx tsc

# Stage 2: Run the application with Node.js v22
FROM node:22-alpine

WORKDIR /usr/src/app

# Copy the compiled files and the node_modules folder from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Run your compiled script
CMD ["node", "dist/binance-alpha-traider.js"]
