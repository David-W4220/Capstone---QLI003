#!/bin/bash

# --- 1. SET PROJECT ROOT ---
# This line ensures the script runs from the directory it is located in,
# regardless of where the user executes it from.
# It makes the relative paths reliable.
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "Starting QLI Inventory System Development Environment..."

# --- 2. START API BACKEND ---
echo "Starting API (dotnet run)..."
# Runs the dotnet project from its relative location in the background (&)
dotnet run --project qli003-api/qli003-api.csproj &

# Get the Process ID (PID) of the last background job (the API)
API_PID=$!

# --- 3. START CLIENT FRONTEND ---
echo "Starting React Client (npm start)..."
# Navigates to client directory and runs npm start in the background
(cd qli003-client && npm start) &

# Get the Process ID (PID) of the last background job (the client)
CLIENT_PID=$!

echo "--------------------------------------------------------"
echo "API PID: $API_PID | Client PID: $CLIENT_PID"
echo "System is running. Press [Ctrl + C] once to stop."
echo "--------------------------------------------------------"

# --- 4. KEEP SCRIPT ALIVE ---
# This loop keeps the shell script running so the terminal window doesn't close,
# but it allows the child processes (API/Client) to run in the background.
# When the user presses Ctrl+C, the trap command runs.
trap "echo -e '\nStopping services...'; kill $API_PID $CLIENT_PID; wait" SIGINT
wait $API_PID