#!/bin/bash

# 🛡️ Safe Migration Script - NEVER use --force-reset in production!
# This script ensures safe database migrations without data loss

echo "🔍 Checking Prisma status..."

# Generate client first
echo "📦 Generating Prisma client..."
npx prisma generate

# Check if we're in development
if [ "$NODE_ENV" = "development" ]; then
    echo "🔧 Development environment detected"
    echo "⚠️  WARNING: This will create a new migration"
    echo "Press Ctrl+C to cancel, or Enter to continue..."
    read -r
    
    # Create migration in dev
    npx prisma migrate dev
else
    echo "🚀 Production/staging environment detected"
    echo "📋 Deploying existing migrations..."
    
    # Deploy existing migrations
    npx prisma migrate deploy
fi

# Regenerate client after migration
echo "🔄 Regenerating Prisma client..."
npx prisma generate

echo "✅ Migration completed successfully!"
echo "🎯 Next: Test your API endpoints"
echo "📚 Tip: Import updated Postman collection from /docs/"