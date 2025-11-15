#!/usr/bin/env node

/**
 * Production Migration Script for Vercel
 * Only runs migrations if DATABASE_URL is set and points to PostgreSQL
 */

const { execSync } = require('child_process');

const databaseUrl = process.env.DATABASE_URL;

console.log('🔍 Checking database configuration...');

// Skip migrations if no DATABASE_URL
if (!databaseUrl) {
  console.log('⚠️  No DATABASE_URL found - skipping migrations');
  console.log('ℹ️  Set DATABASE_URL in Vercel environment variables for production');
  process.exit(0);
}

// Skip migrations if using SQLite (development only)
if (databaseUrl.startsWith('file:')) {
  console.log('📁 SQLite database detected - skipping migrations (development mode)');
  process.exit(0);
}

// Run migrations for PostgreSQL/MySQL
console.log('🗄️  Production database detected');
console.log('📦 Running Prisma migrations...');

try {
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: process.env
  });
  console.log('✅ Migrations completed successfully');
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  console.error('');
  console.error('📝 Make sure:');
  console.error('   1. DATABASE_URL is set in Vercel environment variables');
  console.error('   2. DATABASE_URL points to a PostgreSQL or MySQL database');
  console.error('   3. Database is accessible from Vercel');
  console.error('');
  process.exit(1);
}
