#!/bin/bash

echo "==== Setting up Onryl Entrance Clone ===="
echo "Installing dependencies..."

# Check if bun is installed
if command -v bun &> /dev/null; then
    echo "Using Bun as package manager"
    bun install
    echo "Starting development server..."
    bun run dev
else
    # Check if npm is installed
    if command -v npm &> /dev/null; then
        echo "Using npm as package manager"
        npm install
        echo "Starting development server..."
        npm run dev
    else
        echo "Error: Neither Bun nor npm is installed."
        echo "Please install Bun (recommended) from https://bun.sh/ or npm from https://nodejs.org/"
        exit 1
    fi
fi

echo "==== Setup Complete ===="
echo "Open http://localhost:3000 in your browser"
