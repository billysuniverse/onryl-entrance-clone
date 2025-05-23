#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install
# or use: yarn install
# or use: bun install

# Build the application
echo "Building the application..."
npm run build --no-lint
# or use: yarn build --no-lint
# or use: bun run build --no-lint

echo "Setup complete! You can now start the application with:"
echo "npm run dev"
echo "or"
echo "yarn dev"
echo "or"
echo "bun run dev"
