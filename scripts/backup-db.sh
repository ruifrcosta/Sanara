#!/bin/bash

# Configuration
DB_NAME="sanara"
DB_USER="sanara"
BACKUP_DIR="/backups/postgres"
S3_BUCKET="sanara-backups"
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"

# Create backup
echo "Creating backup: $BACKUP_FILE"
PGPASSWORD=$DB_PASSWORD pg_dump -h localhost -U $DB_USER $DB_NAME | gzip > $BACKUP_FILE

# Upload to S3
echo "Uploading backup to S3"
aws s3 cp $BACKUP_FILE s3://$S3_BUCKET/postgres/

# Delete local backup
rm $BACKUP_FILE

# Delete old backups from S3
echo "Cleaning up old backups"
aws s3 ls s3://$S3_BUCKET/postgres/ | while read -r line;
do
    createDate=`echo $line|awk {'print $1" "$2'}`
    createDate=`date -d"$createDate" +%s`
    olderThan=`date -d"-$RETENTION_DAYS days" +%s`
    if [[ $createDate -lt $olderThan ]]
    then 
        fileName=`echo $line|awk {'print $4'}`
        if [[ $fileName != "" ]]
        then
            echo "Deleting $fileName"
            aws s3 rm s3://$S3_BUCKET/postgres/$fileName
        fi
    fi
done

echo "Backup completed successfully" 