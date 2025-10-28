#!/bin/bash

echo "🚀 Deploying Frontend to Vercel..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the frontend directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project to check for errors
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy
vercel --prod

echo "🎉 Deployment completed!"
echo ""
echo "Your frontend should now be live on Vercel!"
echo "Make sure to configure these environment variables in Vercel dashboard:"
echo "- VITE_BACKEND_URL"
echo "- VITE_RAZORPAY_KEY_ID"  
echo "- VITE_STRIPE_PUBLISHABLE_KEY"
echo "- VITE_CLOUDINARY_CLOUD_NAME"