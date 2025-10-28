#!/bin/bash

echo "🚀 Vercel Deployment Setup Guide"
echo "================================="

# Step 1: Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
else
    echo "✅ Vercel CLI is already installed"
fi

echo ""
echo "🔐 Step 1: Login to Vercel"
echo "Run this command and follow the prompts:"
echo "vercel login"
echo ""
echo "This will:"
echo "- Open a browser window"
echo "- Ask you to sign in with GitHub/GitLab/Bitbucket/Email"
echo "- Generate an authentication token"
echo ""

echo "📝 Step 2: After login, deploy with:"
echo "vercel --prod"
echo ""

echo "🔧 Step 3: During first deployment, you'll be asked:"
echo "- Set up and deploy? → YES"
echo "- Which scope? → Select your account"
echo "- Link to existing project? → NO (create new)"
echo "- Project name? → ambika-international (or your preferred name)"
echo "- Directory? → ./ (current directory)"
echo "- Override settings? → NO (use package.json settings)"
echo ""

echo "⚙️  Step 4: After deployment, add environment variables:"
echo "Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables"
echo ""
echo "Add these variables:"
echo "VITE_BACKEND_URL=https://ambika-international.onrender.com/api"
echo "VITE_RAZORPAY_KEY_ID=rzp_test_1DP5mmOlF5G5ag"
echo "VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51RyV8zK1WiBY8SzjEylxiazzAHq64Z5IrBSCmk3gITpUcL5H87zl3JyZT1jZFHMSJEkzddCPYrKUfpD7qdmpQGjW00vJMfk7l3"
echo "VITE_CLOUDINARY_CLOUD_NAME=dn871vtry"
echo ""

echo "🔄 Step 5: Redeploy after adding environment variables:"
echo "vercel --prod"
echo ""

echo "🎉 Your deployment will be ready!"
echo ""
echo "🔗 Quick Commands:"
echo "1. vercel login"
echo "2. vercel --prod"
echo "3. Add environment variables in dashboard"
echo "4. vercel --prod (redeploy)"

exit 0