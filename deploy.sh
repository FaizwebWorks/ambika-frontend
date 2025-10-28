#!/bin/bash

# Production Deployment Script for Frontend

echo "🚀 Starting Frontend Production Deployment..."

# Exit on any error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Node.js version: $(node --version)"
print_status "npm version: $(npm --version)"

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    print_warning ".env.production file not found. Creating from template..."
    touch .env.production
    print_warning "Please configure your .env.production file with production values"
fi

# Build the application
print_status "Building application for production..."
npm run build

# Test the build
if [ -d "dist" ]; then
    print_status "Build completed successfully!"
    print_status "Build size: $(du -sh dist | cut -f1)"
else
    print_error "Build failed - dist directory not found"
    exit 1
fi

# Optional: Run tests
print_status "Running tests..."
npm test --if-present

print_status "Frontend deployment completed successfully!"
print_warning "Don't forget to:"
print_warning "1. Configure your .env.production file"
print_warning "2. Upload the 'dist' folder to your hosting provider"
print_warning "3. Configure your web server to serve the static files"
print_warning "4. Set up SSL certificates"
print_warning "5. Configure CDN if needed"

echo ""
echo "🎉 Built files are ready in the 'dist' directory!"