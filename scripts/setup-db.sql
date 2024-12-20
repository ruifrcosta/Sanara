-- Create the database if it doesn't exist
CREATE DATABASE sanara;

-- Create the user if it doesn't exist
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'sanara') THEN
      CREATE USER sanara WITH PASSWORD 'sanara123';
   END IF;
END
$do$;

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON DATABASE sanara TO sanara;

-- Connect to the sanara database
\c sanara;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO sanara; 