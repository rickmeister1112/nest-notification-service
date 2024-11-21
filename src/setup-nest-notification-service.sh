#!/bin/bash

# Exit script on error
set -e

# 1. Install NestJS CLI globally if not installed
if ! command -v nest &> /dev/null
then
    echo "NestJS CLI not found. Installing globally..."
    npm install -g @nestjs/cli
else
    echo "NestJS CLI is already installed."
fi

# 2. Create a new NestJS project
echo "Creating a new NestJS project: nest-notification-service"
nest new nest-notification-service

# Navigate to project directory
cd nest-notification-service

# 3. Install required dependencies
echo "Installing required dependencies..."

npm install @nestjs/typeorm typeorm mysql2
npm install @nestjs/mongoose mongoose
npm install aws-sdk
npm install @nestjs/bull bull
npm install @nestjs/schedule

# 4. Set up folder structure
echo "Creating necessary directories..."

mkdir -p src/api src/services src/middleware src/handlers src/queue src/scheduler src/base src/entities/mysql src/entities/dynamo src/entities/mongo

# 5. Build and run the project
echo "Building and starting the project..."

npm run build
npm run start

echo "NestJS project setup completed!"
