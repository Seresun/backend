#!/bin/bash

echo "Setting up Todo Backend..."

echo "Creating .env file..."
cp env.example .env

echo "Installing dependencies..."
npm install

echo "Generating Prisma client..."
npx prisma generate

echo "Running database migrations..."
npx prisma migrate dev --name init

echo "Seeding database..."
npx ts-node prisma/seed.ts

echo "Setup complete! You can now run:"
echo "  npm run start:dev"
