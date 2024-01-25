#!/bin/bash
set -e
TIME=`date +%d-%m-%Y-%H-%M`
SCRIPT_NAME=backup-mongodb
ARCHIVE_NAME=mongodump_prod_$TIME.tar.gz

# MONGODB_URI_MONGO_ADMIN="mongodb+srv://cric-local-dev-user:OxpyvGHYtOP78ChZ@mongodb-local-dev-headless.local-dev.svc.cluster.local/admin?replicaSet=rs0&authSource=admin&retryWrites=true&w=majority&ssl=false&tls=false"
# MONGODB_URI_ARTICLE="mongodb+srv://cric-local-dev-user:OxpyvGHYtOP78ChZ@mongodb-local-dev-headless.local-dev.svc.cluster.local/crictracker-article-dev?replicaSet=rs0&authSource=admin&retryWrites=true&w=majority&ssl=false&tls=false"
# MONGODB_URI_AUTHENTICATION="mongodb+srv://cric-local-dev-user:OxpyvGHYtOP78ChZ@mongodb-local-dev-headless.local-dev.svc.cluster.local/crictracker-auth-dev?replicaSet=rs0&authSource=admin&retryWrites=true&w=majority&ssl=false&tls=false"
# MONGODB_URI_CAREER="mongodb+srv://cric-local-dev-user:OxpyvGHYtOP78ChZ@mongodb-local-dev-headless.local-dev.svc.cluster.local/crictracker-career-dev?replicaSet=rs0&authSource=admin&retryWrites=true&w=majority&ssl=false&tls=false"
# MONGODB_URI_GLOBAL_WIDGET="mongodb+srv://cric-local-dev-user:OxpyvGHYtOP78ChZ@mongodb-local-dev-headless.local-dev.svc.cluster.local/crictracker-widget-dev?replicaSet=rs0&authSource=admin&retryWrites=true&w=majority&ssl=false&tls=false"
# MONGODB_URI_HELP="mongodb+srv://cric-local-dev-user:OxpyvGHYtOP78ChZ@mongodb-local-dev-headless.local-dev.svc.cluster.local/crictracker-help-dev?replicaSet=rs0&authSource=admin&retryWrites=true&w=majority&ssl=false&tls=false"
# MONGODB_URI_MATCHMANAGEMENT="mongodb+srv://cric-local-dev-user:OxpyvGHYtOP78ChZ@mongodb-local-dev-headless.local-dev.svc.cluster.local/crictracker-match-dev?replicaSet=rs0&authSource=admin&retryWrites=true&w=majority&ssl=false&tls=false"
# MONGODB_URI_MIGRATION="mongodb+srv://cric-local-dev-user:OxpyvGHYtOP78ChZ@mongodb-local-dev-headless.local-dev.svc.cluster.local/crictracker-migration?replicaSet=rs0&authSource=admin&retryWrites=true&w=majority&ssl=false&tls=false"
# MONGODB_URI_SEO="mongodb+srv://cric-local-dev-user:OxpyvGHYtOP78ChZ@mongodb-local-dev-headless.local-dev.svc.cluster.local/crictracker-seo-dev?replicaSet=rs0&authSource=admin&retryWrites=true&w=majority&ssl=false&tls=false"
# MONGODB_URI_SUBSCRIPTION="mongodb+srv://cric-local-dev-user:OxpyvGHYtOP78ChZ@mongodb-local-dev-headless.local-dev.svc.cluster.local/crictracker-match-dev?replicaSet=rs0&authSource=admin&retryWrites=true&w=majority&ssl=false&tls=false"

MONGODB_URI_MONGO_ADMIN="mongodb+srv://crictracker-backup:VVAckHo64bFJIjxP@crictracker.iexb0.mongodb.net/admin?retryWrites=true&w=majority"
MONGODB_URI_ARTICLE="mongodb+srv://crictracker-backup:VVAckHo64bFJIjxP@crictracker.iexb0.mongodb.net/crictracker-article-live?retryWrites=true&w=majority"
MONGODB_URI_AUTHENTICATION="mongodb+srv://crictracker-backup:VVAckHo64bFJIjxP@crictracker.iexb0.mongodb.net/crictracker-auth-live?retryWrites=true&w=majority"
MONGODB_URI_CAREER="mongodb+srv://crictracker-backup:VVAckHo64bFJIjxP@crictracker.iexb0.mongodb.net/crictracker-career-live?retryWrites=true&w=majority"
MONGODB_URI_GLOBAL_WIDGET="mongodb+srv://crictracker-backup:VVAckHo64bFJIjxP@crictracker.iexb0.mongodb.net/crictracker-widget-live?retryWrites=true&w=majority"
MONGODB_URI_HELP="mongodb+srv://crictracker-backup:VVAckHo64bFJIjxP@crictracker.iexb0.mongodb.net/crictracker-help-live?retryWrites=true&w=majority"
MONGODB_URI_MATCHMANAGEMENT="mongodb+srv://crictracker-backup:VVAckHo64bFJIjxP@crictracker.iexb0.mongodb.net/crictracker-match-live?retryWrites=true&w=majority"
MONGODB_URI_MIGRATION="mongodb+srv://crictracker-backup:VVAckHo64bFJIjxP@crictracker.iexb0.mongodb.net/crictracker-migration-live?retryWrites=true&w=majority"
MONGODB_URI_SEO="mongodb+srv://crictracker-backup:VVAckHo64bFJIjxP@crictracker.iexb0.mongodb.net/crictracker-seo-live?retryWrites=true&w=majority"
MONGODB_URI_SUBSCRIPTION="mongodb+srv://crictracker-backup:VVAckHo64bFJIjxP@crictracker.iexb0.mongodb.net/crictracker-match-live?retryWrites=true&w=majority"

BUCKET_URI=s3://crictracker-mongodbdumps-08032022/crictracker-prod

mkdir mongodb-prod

echo "[$SCRIPT_NAME] Dumping all MongoDB databases to compressed archive..."

mongodump --uri="$MONGODB_URI_MONGO_ADMIN" --out="mongodb-prod"
mongodump --uri="$MONGODB_URI_ARTICLE" --out="mongodb-prod"
mongodump --uri "$MONGODB_URI_AUTHENTICATION" --out="mongodb-prod"
mongodump --uri "$MONGODB_URI_CAREER" --out="mongodb-prod"
mongodump --uri "$MONGODB_URI_GLOBAL_WIDGET" --out="mongodb-prod"
mongodump --uri "$MONGODB_URI_HELP" --out="mongodb-prod"
mongodump --uri "$MONGODB_URI_MATCHMANAGEMENT" --out="mongodb-prod"
mongodump --uri "$MONGODB_URI_MIGRATION" --out="mongodb-prod"
mongodump --uri "$MONGODB_URI_SEO" --out="mongodb-prod"
mongodump --uri "$MONGODB_URI_SUBSCRIPTION" --out="mongodb-prod"

echo "[$SCRIPT_NAME] Uploading compressed archive to S3 bucket..."
tar cvzf crictracker-prod-$TIME.tar.gz mongodb-prod/
aws s3 cp crictracker-prod-$TIME.tar.gz $BUCKET_URI/crictracker-prod-$TIME.tar.gz

echo "[$SCRIPT_NAME] Cleaning up compressed archive..."

echo "[$SCRIPT_NAME] Backup complete!"