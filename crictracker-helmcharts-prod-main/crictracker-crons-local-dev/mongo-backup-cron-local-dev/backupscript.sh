#!/bin/bash
set -e
TIME=`date +%d-%m-%Y-%H-%M`
SCRIPT_NAME=backup-mongodb
ARCHIVE_NAME=mongodump_local_dev_$TIME.tar.gz

MONGODB_URI_MONGO_ADMIN="mongodb+srv://cric-local-dev-user:OxpyvGHYtOP78ChZ@mongodb-local-dev-headless.local-dev.svc.cluster.local/admin?replicaSet=rs0&authSource=admin&retryWrites=true&w=majority&ssl=false&tls=false"
MONGODB_URI_ARTICLE="mongodb+srv://cric-local-dev-user:OxpyvGHYtOP78ChZ@mongodb-local-dev-headless.local-dev.svc.cluster.local/crictracker-article-dev?replicaSet=rs0&authSource=admin&retryWrites=true&w=majority&ssl=false&tls=false"
MONGODB_URI_AUTHENTICATION="mongodb+srv://cric-local-dev-user:OxpyvGHYtOP78ChZ@mongodb-local-dev-headless.local-dev.svc.cluster.local/crictracker-auth-dev?replicaSet=rs0&authSource=admin&retryWrites=true&w=majority&ssl=false&tls=false"
MONGODB_URI_CAREER="mongodb+srv://cric-local-dev-user:OxpyvGHYtOP78ChZ@mongodb-local-dev-headless.local-dev.svc.cluster.local/crictracker-career-dev?replicaSet=rs0&authSource=admin&retryWrites=true&w=majority&ssl=false&tls=false"
MONGODB_URI_GLOBAL_WIDGET="mongodb+srv://cric-local-dev-user:OxpyvGHYtOP78ChZ@mongodb-local-dev-headless.local-dev.svc.cluster.local/crictracker-widget-dev?replicaSet=rs0&authSource=admin&retryWrites=true&w=majority&ssl=false&tls=false"
MONGODB_URI_HELP="mongodb+srv://cric-local-dev-user:OxpyvGHYtOP78ChZ@mongodb-local-dev-headless.local-dev.svc.cluster.local/crictracker-help-dev?replicaSet=rs0&authSource=admin&retryWrites=true&w=majority&ssl=false&tls=false"
MONGODB_URI_MATCHMANAGEMENT="mongodb+srv://cric-local-dev-user:OxpyvGHYtOP78ChZ@mongodb-local-dev-headless.local-dev.svc.cluster.local/crictracker-match-dev?replicaSet=rs0&authSource=admin&retryWrites=true&w=majority&ssl=false&tls=false"
MONGODB_URI_MIGRATION="mongodb+srv://cric-local-dev-user:OxpyvGHYtOP78ChZ@mongodb-local-dev-headless.local-dev.svc.cluster.local/crictracker-migration?replicaSet=rs0&authSource=admin&retryWrites=true&w=majority&ssl=false&tls=false"
MONGODB_URI_SEO="mongodb+srv://cric-local-dev-user:OxpyvGHYtOP78ChZ@mongodb-local-dev-headless.local-dev.svc.cluster.local/crictracker-seo-dev?replicaSet=rs0&authSource=admin&retryWrites=true&w=majority&ssl=false&tls=false"
MONGODB_URI_SUBSCRIPTION="mongodb+srv://cric-local-dev-user:OxpyvGHYtOP78ChZ@mongodb-local-dev-headless.local-dev.svc.cluster.local/crictracker-match-dev?replicaSet=rs0&authSource=admin&retryWrites=true&w=majority&ssl=false&tls=false"

BUCKET_URI=s3://crictracker-mongodbdumps-08032022/crictracker-local-dev

mkdir mongodb-local-dev

echo "[$SCRIPT_NAME] Dumping all MongoDB databases to compressed archive..."

mongodump --uri="$MONGODB_URI_MONGO_ADMIN" --out="mongodb-local-dev"
mongodump --uri="$MONGODB_URI_ARTICLE" --out="mongodb-local-dev"
mongodump --uri "$MONGODB_URI_AUTHENTICATION" --out="mongodb-local-dev"
mongodump --uri "$MONGODB_URI_CAREER" --out="mongodb-local-dev"
mongodump --uri "$MONGODB_URI_GLOBAL_WIDGET" --out="mongodb-local-dev"
mongodump --uri "$MONGODB_URI_HELP" --out="mongodb-local-dev"
mongodump --uri "$MONGODB_URI_MATCHMANAGEMENT" --out="mongodb-local-dev"
mongodump --uri "$MONGODB_URI_MIGRATION" --out="mongodb-local-dev"
mongodump --uri "$MONGODB_URI_SEO" --out="mongodb-local-dev"
mongodump --uri "$MONGODB_URI_SUBSCRIPTION" --out="mongodb-local-dev"

echo "[$SCRIPT_NAME] Uploading compressed archive to S3 bucket..."
tar cvzf crictracker-local-dev-$TIME.tar.gz mongodb-local-dev/
aws s3 cp crictracker-local-dev-$TIME.tar.gz $BUCKET_URI/crictracker-local-dev-$TIME.tar.gz

echo "[$SCRIPT_NAME] Cleaning up compressed archive..."

echo "[$SCRIPT_NAME] Backup complete!"