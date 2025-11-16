# QLI003 Application
This application will be used to track QLI's OT inventory closet and have a user based system where they can see what items are available to take out or put back in if they've ordered them. It will also send out emails if stock is at a certain threshhold with links (if provided) to repurchase items.
There will also be logs to audit what is going in and out and admin privileges to add, remove, or modify any items that they need.

## Release Notes
As of right now our app has functioning database, backend, frontend connections that make them work together in real time. There is a barebones UI to test functions with the SignalR sockets and the program can be editted currently to connect from any device on the local network.
We are still editing the database a little but but all of the features and work that has been done is either in line with our milestone plan or even more than what was expected.\
There are plans to work on email sending, user verification, and updating the UI of the application.\
Below is extra stuff for logging of packages, requirements, etc. in case others need them.


## Packages and misc.
npx create react app basis\
dotnet new webapi basis\
Extra packages are MySql.Data.EntityFrameworkCore, MySql.Data, Microsoft.AspNetCore.SignalR for .NET\
Extra packages are @microsoft/signalr for React\
Had to include <script src="https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/7.0.0/signalr.min.js"></script> in index.html for signalr to work

## Requirements
Install node.js .net8.0 mysql community server and workbench: workbench is optional, I would watch a video on the server if you don't know about it but maybe thats just mac\
You'll want the c# dev kit on vs code\
May need to run npm install in the client console.

## How to Run
Update database=schema to whatever you called it, user and password in appsetings.json in api\
Update local host stuff like port if needed to match what .NET api is running on same thing with inventoryapp.jsx in client

Open terminal for qli003-api  dotnet run\
open terminal for qli003-client npm start - might have to do npm install first too

Basically once you start the .NET and then go to the API and start that it opens a localhost that currently provides a whole list of the equipment table and you can chose from a dropdown an item youd like the change the description of. The main test of this was to see how to implement real time database changes and how to link up sql - dotnet - react.js

---------

# Mailing Feature

## New files added
- ReportController.cs (under controllers/)
- services/EmailService.cs

## Requirements
- Packages
```
cd qli003-api
dotnet add package MailKit
dotnet add package QuestPDF
```

- Install Papercut SMTP to view the mail and PDF attatchment

- Register new mail service in Program.cs by adding this line 
`builder.Services.AddScoped<qli003_api.Services.EmailService>();`<br>   
Before<br>  
`builder.WebHost.UseUrls("http://0.0.0.0:5097");`

- Configure SMTP in appsettings.json
```
"SMTP": {
  "Host": "localhost",
  "Port": 25,
  "Username": "",
  "Password": ""
}
```

## How to run(without using frontend):
1. Do `dotnet run`, open [Swagger UI](http://localhost:5097/swagger/index.html), find Report's POST /api/Report/send, click "Try it out" and then "Execute". You should see a `{ "message": "Report sent successfully."}` in the Response body beneath.
2. Go to Papercut SMTP UI, the plain text message should be viewable under "message" while "Headers" should contain other mail info. As for the pdf report, right click, save as to view it locally if you cant open it directly under "Sections" 

## Notes
In future this should link to frontend react which should add a button to generate such mail instead of swagger.(Already Achieved)

---------

# UI Enhancement & Modal Components Update - November 9, 2025

## New Features Added

### 1. Modal Components (components-new/)
Merge austin's three new modal components with Tailwind CSS (no external dependencies):
- **EquipmentUpdateModal.jsx** - Update equipment descriptions via modal popup
- **EquipmentDetailsModal.jsx** - View detailed equipment information by clicking table rows
- **EquipmentSignOutModal.jsx** - Check Out equipment with transaction logging

### 2. UI Improvements
- Removed inline update form in favor of cleaner modal interface
- Made table rows clickable to view equipment details
- Added "Check Out Equipment" button with full transaction tracking
- Implemented dynamic table rendering that displays all table types (Equipment, Admins, Auditlog, Transactionlog)

### 3. Mobile Responsiveness
- Enhanced mobile and tablet compatibility
- Responsive table with overflow handling
- Touch-friendly buttons and modals
- Adaptive layouts for different screen sizes

### 4. Bug Fixes
- Fixed transaction log foreign key constraint (changed `Inventory_ID` to `Equipment_ID`)
- Fixed modal visibility issues (buttons now stay visible when modal opens)
- Added proper error handling and user feedback messages
- Improved data refresh after operations

## Files Modified
- `src/Inventory-App.jsx` - Main application with modal integration and dynamic table
- `src/components-new/EquipmentUpdateModal.jsx` - Modal for updates
- `src/components-new/EquipmentDetailsModal.jsx` - Modal for viewing details
- `src/components-new/EquipmentSignOutModal.jsx` - Modal for sign-out with transaction logging

## How to Use New Features

### View Equipment Details
- Click any row in the Equipment table to see full details including stock status and reorder information

### Update Equipment
- Click "Update Equipment" button
- Select equipment and modify description
- Changes save and refresh automatically

### Check Out Equipment
- Click "Checkout Equipment" button
- Enter your name (required)
- Select equipment and quantity
- Optionally add notes
- System creates transaction log entry and updates inventory count

### View Transaction History
- Use the table dropdown at the top
- Select "Transactionlog" to see all check-in/check-out history
- View timestamps, quantities, and user notes

## Technical Notes
- All modals use Tailwind CSS for consistent styling
- No external modal libraries required (removed react-modal dependency)
- Real-time updates via SignalR still functional
- Transaction logs properly track equipment sign-outs with foreign key constraints