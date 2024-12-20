#!/bin/bash

# Configuration
DB_NAME="sanara"
DB_USER="sanara"
S3_BUCKET="sanara-backups"
RESTORE_DIR="/tmp/restore"

# Check if backup file is provided
if [ -z "$1" ]
then
    echo "Please provide backup file name"
    echo "Usage: $0 backup_file_name"
    exit 1
fi

BACKUP_FILE=$1

# Create restore directory
mkdir -p $RESTORE_DIR

# Download backup from S3
echo "Downloading backup from S3"
aws s3 cp s3://$S3_BUCKET/postgres/$BACKUP_FILE $RESTORE_DIR/$BACKUP_FILE

# Drop existing database
echo "Dropping existing database"
PGPASSWORD=$DB_PASSWORD psql -h localhost -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"

# Create new database
echo "Creating new database"
PGPASSWORD=$DB_PASSWORD psql -h localhost -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"

# Restore backup
echo "Restoring backup"
gunzip -c $RESTORE_DIR/$BACKUP_FILE | PGPASSWORD=$DB_PASSWORD psql -h localhost -U $DB_USER -d $DB_NAME

# Clean up
rm -rf $RESTORE_DIR

echo "Restore completed successfully" 