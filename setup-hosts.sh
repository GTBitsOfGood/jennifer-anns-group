#!/bin/bash

HOSTNAME="mongo"
IP_ADDRESS="127.0.0.1"

# Check if the entry already exists
if ! grep -q "$HOSTNAME" /etc/hosts; then
  echo "Adding $HOSTNAME to /etc/hosts..."
  echo "$IP_ADDRESS $HOSTNAME" | sudo tee -a /etc/hosts
  echo "Entry added successfully."
else
  echo "$HOSTNAME already exists in /etc/hosts."
fi