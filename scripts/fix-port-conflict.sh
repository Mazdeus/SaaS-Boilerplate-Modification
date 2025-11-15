#!/bin/bash

# Script to fix port 3000 conflict on Azure VM

echo "🔍 Checking what's using port 3000..."
echo ""

# Check what process is using port 3000
PORT_PID=$(sudo lsof -ti:3000)

if [ -z "$PORT_PID" ]; then
    echo "✅ Port 3000 is free!"
else
    echo "⚠️  Port 3000 is being used by process(es): $PORT_PID"
    echo ""
    echo "Process details:"
    sudo lsof -i:3000
    echo ""
    
    # Check if it's a Docker container
    DOCKER_CONTAINER=$(docker ps -q --filter "publish=3000")
    
    if [ ! -z "$DOCKER_CONTAINER" ]; then
        echo "🐳 Found Docker container using port 3000: $DOCKER_CONTAINER"
        echo ""
        read -p "Stop this Docker container? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "Stopping container..."
            docker stop $DOCKER_CONTAINER
            echo "✅ Container stopped!"
        fi
    else
        echo "Process is not a Docker container."
        echo ""
        read -p "Kill this process? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "Killing process $PORT_PID..."
            sudo kill -9 $PORT_PID
            echo "✅ Process killed!"
        fi
    fi
fi

echo ""
echo "Checking port 3000 again..."
if sudo lsof -ti:3000 > /dev/null 2>&1; then
    echo "❌ Port 3000 is still in use!"
    echo "Try manually: sudo lsof -i:3000"
else
    echo "✅ Port 3000 is now free!"
    echo ""
    echo "You can now run: docker-compose up -d"
fi
