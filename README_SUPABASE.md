# Expency App - Supabase Integration Guide

This guide will help you set up the Supabase backend for the Expency application.

## Supabase Setup

### 1. Database Tables

You need to create two main tables in your Supabase project:

#### Income Table

| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| id | bigint (auto-increment) | Primary key |
| created_at | timestamp with time zone (default now()) | When the record was created |
| title | text | Title of the income transaction |
| category | text | Category of the income |
| date | date | Date of the income transaction |
| amount | real | Income amount |
| userid | uuid | Foreign key to auth.users table |
| description | text | Optional description |

#### Expense Table (named 'expanse' in Supabase)

| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| id | bigint (auto-increment) | Primary key |
| created_at | timestamp with time zone (default now()) | When the record was created |
| title | text | Title of the expense transaction |
| category | text | Category of the expense |
| date | date | Date of the expense transaction |
| amount | real | Expense amount |
| userid | uuid | Foreign key to auth.users table |
| description | text | Optional description |

### 2. Row-Level Security (RLS) Policies

For each table, you need to set up Row-Level Security policies to ensure users can only access their own data.

#### For both tables (income and expanse)

Enable RLS on both tables, then add these policies:

**For Reading Data:**

```sql
CREATE POLICY "Users can view their own data" ON public.[table_name]
FOR SELECT
USING (auth.uid() = userid);
```

**For Creating Data:**

```sql
CREATE POLICY "Users can create their own data" ON public.[table_name]
FOR INSERT
WITH CHECK (auth.uid() = userid);
```

**For Updating Data:**

```sql
CREATE POLICY "Users can update their own data" ON public.[table_name]
FOR UPDATE
USING (auth.uid() = userid);
```

**For Deleting Data:**

```sql
CREATE POLICY "Users can delete their own data" ON public.[table_name]
FOR DELETE
USING (auth.uid() = userid);
```

Replace `[table_name]` with either `income` or `expanse` for each policy.

## Application Configuration

The app is already set up to use the Supabase backend with the credentials you provided:

```javascript
SUPABASE_URL=https://kufnaslatxucdhsuuoar.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Zm5hc2xhdHh1Y2Roc3V1b2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNjc5OTcsImV4cCI6MjA2MjY0Mzk5N30.Pda-IX0JWULX4pYosI6ahnS0ltl2XKoMXreFsA-Vbyg
```

These are configured in the `src/config/supabase.js` file.

## Authentication

The application uses Supabase's built-in authentication system. Users can:

1. Sign up with email and password
2. Sign in with email and password
3. Sign out

## Data Management

The application handles data through the TransactionContext, which:

1. Fetches transactions for the logged-in user
2. Adds new income or expense transactions
3. Updates existing transactions
4. Deletes transactions

The data is filtered by the user's ID to ensure each user only sees their own data.

## Running the Application

1. Make sure you've set up the Supabase tables and RLS policies correctly
2. Install the app dependencies: `npm install`
3. Start the app: `npm start`

## Troubleshooting

If you encounter issues with the Supabase integration:

1. Check that your Supabase project is up and running
2. Verify that the tables are set up correctly with the proper columns
3. Make sure RLS policies are properly configured
4. Check the app console for any error messages

For more detailed information about Supabase, visit the [Supabase documentation](https://supabase.io/docs).
