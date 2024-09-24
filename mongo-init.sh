#!/bin/bash

set -e

echo "Starting MongoDB initialization script..."

# Function to log messages with timestamps
log() {
    echo "[$(date)] $1"
}

mongod --replSet rs0 --bind_ip_all --quiet --setParameter logLevel=0 &
MONGO_PID=$!

# Wait for MongoDB to start up
log "Waiting for MongoDB to start..."
max_attempts=30
attempt=0
while ! mongosh --eval "print(\"waited for connection\")" --quiet; do
    attempt=$((attempt+1))
    if [ $attempt -eq $max_attempts ]; then
        log "Error: MongoDB failed to start after $max_attempts attempts."
        exit 1
    fi
    log "Attempt $attempt: MongoDB not ready, waiting..."
    sleep 2
done

log "MongoDB started successfully."

# Check if the replica set is already initialized
log "Checking if replica set needs to be initialized..."
replica_status=$(mongosh --eval "rs.status()" --quiet || echo "NotYetInitialized")
if echo "$replica_status" | grep -q "NotYetInitialized"; then
    log "Replica set not initialized. Initializing now..."

    # Initialize the replica set
    log "Initializing replica set..."
    mongosh --eval '
    config = {
        "_id" : "rs0",
        "members" : [
            {
                "_id" : 0,
                "host" : "mongo:27017"
            } 
        ]
    };
    rs.initiate(config);
    '

    # Wait for the replica set to be fully initialized
    log "Waiting for replica set to be fully initialized..."
    attempt=0
    while ! mongosh --eval "rs.status().ok" | grep -q 1; do
        attempt=$((attempt+1))
        if [ $attempt -eq $max_attempts ]; then
            log "Error: Replica set failed to initialize after $max_attempts attempts."
            exit 1
        fi
        log "Attempt $attempt: Replica set not ready, waiting..."
        sleep 2
    done

    log "Replica set initialized successfully."
else
    log "Replica set already initialized."
fi

log "MongoDB initialization complete. Keeping container running..."

# Keep the container running
tail -f /dev/null
