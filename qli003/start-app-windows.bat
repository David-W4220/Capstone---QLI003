@echo off
REM --- QLI Inventory System Development Startup (Windows) ---

REM --- Set the current directory as the working root for reliable relative paths ---
pushd "%~dp0"

echo Starting QLI API Backend in a new window...

REM Start the API: /D specifies the working directory. The program runs directly.
start "QLI API" /D "qli003-api" dotnet run

echo Starting QLI Client Frontend in a new window...

REM Start the Client: /D specifies the working directory.
start "QLI Client" /D "qli003-client" npm start

echo.
echo Both services are starting in new command windows.
echo You must manually close these windows when finished developing.
echo.
pause

REM --- Return to the original directory ---
popd