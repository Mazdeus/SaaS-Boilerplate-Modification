# Database Setup Scripts

This folder contains manual database setup and utility scripts for the BRODO SaaS Boilerplate project.

## Files

### `setup-complete.sql`
- **Purpose**: Complete database schema + real BRODO company data
- **Usage**: One-shot setup for new environments
- **Features**: 
  - Creates 19 tables with proper relationships
  - Populates 14 tables with real company data
  - Includes constraints, indexes, and foreign keys
  - Safe to run multiple times (uses IF NOT EXISTS and ON CONFLICT)

## Usage

```bash
# Setup database from scratch
npm run db:setup

# Test connection
npm run db:test

# Validate setup
npm run db:validate
```

## Notes

- This is separate from `/migrations` folder (Drizzle ORM auto-generated)
- Contains production-ready data from BRODO company
- Safe for existing databases (idempotent operations)
