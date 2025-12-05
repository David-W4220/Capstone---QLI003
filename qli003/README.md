## Packages and misc.
npx create react app basis\
dotnet new webapi basis\
Extra packages are MySql.Data.EntityFrameworkCore, MySql.Data, Microsoft.AspNetCore.SignalR for .NET\
Extra packages are @microsoft/signalr for React\
For react to work had to include <script src="https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/7.0.0/signalr.min.js"></script> for signalr to work

## Requirements
Install node.js .net8.0 mysql community server and workbench: workbench is optional, I would watch a video on the server if you don't know about it but maybe thats just mac\
Youll want the c# dev kit on vs code

## How to Run

### Prerequisites
1. Update `qli003-api/appsettings.json` with your database connection string (server, database name, user, password)
2. Update `qli003-api/Properties/appsettings.json` with whatever port you want the backend to run on
3. Update `qli003-client/src/` API URLs to match your .NET API host/port if not using default

### Start the Application

#### Quick Start (Recommended)
Use the startup scripts to launch both API and client in one command:

**Windows:**
```cmd
start-app-windows.bat
```

**Mac/Linux:**
```bash
./start-app-mac.command
```

#### Manual Start (if preferred)
1. **Backend (.NET API)**
   ```
   cd qli003-api
   dotnet run
   ```

2. **Frontend (React)** (in a separate terminal)
   ```
   cd qli003-client
   npm install    # First time only, or if dependencies changed
   npm start
   ```

### Running Tests

#### Frontend Unit Tests
Tests cover modal interactions, form validation, and network mocking.

```powershell
cd qli003-client
npm install          # First time setup
$env:CI='true'; npm test -- --runInBand    # Run all tests once (CI mode)
npm test             # Interactive test runner (watch mode, press 'a' for all)
npm test -- -t EquipmentUpdateModal        # Run tests matching a pattern
```

**Note:** If you get PowerShell execution policy errors:
```powershell
# Set policy for current user (no admin needed)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# Then retry the npm command above
```

Alternatively, run from Command Prompt (cmd.exe) which doesn't have the policy issue:
```cmd
cd qli003-client
npm ci
set CI=true
npm test -- --runInBand
```

#### Test Coverage
- `src/components/__tests__/EquipmentDetailsModal.test.jsx` — Details modal rendering and close behavior
- `src/components/__tests__/EquipmentSignOutModal.test.jsx` — Sign-out workflow with name validation
- `src/components/__tests__/EquipmentUpdateModal.test.jsx` — Description validation and update flow
- `src/App.test.js` — App header rendering

Basically once you start the .NET and then go to the API and start that it opens a localhost that currently provides a whole list of the equipment table and you can chose from a dropdown an item youd like the change the description of. The main test of this was to see how to implement real time database changes and how to link up sql - dotnet - react.js


