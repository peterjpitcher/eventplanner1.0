-- Schema check script for Event Planner
-- Run this in Supabase SQL Editor to verify your schema

-- Display current schema of the customers table
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM 
  information_schema.columns
WHERE 
  table_name = 'customers'
  AND table_schema = 'public'
ORDER BY 
  ordinal_position;

-- Display current schema of the bookings table
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM 
  information_schema.columns
WHERE 
  table_name = 'bookings'
  AND table_schema = 'public'
ORDER BY 
  ordinal_position;

-- Compare with expected schema for customers
WITH expected_columns AS (
  SELECT 'id' as column_name, 'uuid' as data_type UNION
  SELECT 'first_name', 'text' UNION
  SELECT 'last_name', 'text' UNION
  SELECT 'mobile_number', 'text' UNION
  SELECT 'notes', 'text' UNION
  SELECT 'created_at', 'timestamp with time zone'
)
SELECT 
  e.column_name,
  CASE 
    WHEN c.column_name IS NULL THEN 'MISSING' 
    ELSE 'PRESENT' 
  END as status
FROM 
  expected_columns e
LEFT JOIN 
  information_schema.columns c ON e.column_name = c.column_name 
  AND c.table_name = 'customers' 
  AND c.table_schema = 'public';

-- Compare with expected schema for bookings
WITH expected_columns AS (
  SELECT 'id' as column_name, 'uuid' as data_type UNION
  SELECT 'customer_id', 'uuid' UNION
  SELECT 'event_id', 'uuid' UNION
  SELECT 'attendees', 'integer' UNION
  SELECT 'notes', 'text' UNION
  SELECT 'created_at', 'timestamp with time zone'
)
SELECT 
  e.column_name,
  CASE 
    WHEN c.column_name IS NULL THEN 'MISSING' 
    ELSE 'PRESENT' 
  END as status
FROM 
  expected_columns e
LEFT JOIN 
  information_schema.columns c ON e.column_name = c.column_name 
  AND c.table_name = 'bookings' 
  AND c.table_schema = 'public';

-- Extra columns that should be renamed or removed
SELECT 
  column_name,
  'EXTRA - not in application schema' as status
FROM 
  information_schema.columns
WHERE 
  table_name = 'customers'
  AND table_schema = 'public'
  AND column_name NOT IN ('id', 'first_name', 'last_name', 'mobile_number', 'notes', 'created_at', 'updated_at');

SELECT 
  column_name,
  'EXTRA - not in application schema' as status
FROM 
  information_schema.columns
WHERE 
  table_name = 'bookings'
  AND table_schema = 'public'
  AND column_name NOT IN ('id', 'customer_id', 'event_id', 'attendees', 'notes', 'created_at', 'updated_at'); 