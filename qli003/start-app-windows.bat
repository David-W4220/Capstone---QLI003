@echo off
REM --- QLI Inventory System Development Startup (Windows) ---

echo Starting QLI API Backend in a new window...

REM The 'start' command opens a new command prompt window.
REM /D changes the working directory.
REM The '/K' keeps the new window open after the command runs.
start "QLI API" cmd /K "cd qli003-api\qli003-api && dotnet run"

echo Starting QLI Client Frontend in a new window...

REM Start the client in a separate window.
start "QLI Client" cmd /K "cd client && npm start"

echo.
echo Both services are starting in new command windows.
echo Close those windows when you are finished developing.
echo.
pause