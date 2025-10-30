This branch is to allow the testing of launching and adjusting window lock and content when performing certain functions
NOTE: You must have the react-modal package installed for this to properly work.

Copied from Main branch, and may not be 100% up-to-date 100% of the time.

QLI003 Application

This application will be used to track QLI's OT inventory closet and have a user based system where they can see what items are available to take out or put back in if they've ordered them. It will also send out emails if stock is at a certain threshhold with links (if provided) to repurchase items. There will also be logs to audit what is going in and out and admin privileges to add, remove, or modify any items that they need.
Release Notes

As of right now our app has functioning database, backend, frontend connections that make them work together in real time. There is a barebones UI to test functions with the SignalR sockets and the program can be editted currently to connect from any device on the local network. We are still editing the database a little but but all of the features and work that has been done is either in line with our milestone plan or even more than what was expected.
There are plans to work on email sending, user verification, and updating the UI of the application.
Below is extra stuff for logging of packages, requirements, etc. in case others need them.
Packages and misc.

npx create react app basis
dotnet new webapi basis
Extra packages are MySql.Data.EntityFrameworkCore, MySql.Data, Microsoft.AspNetCore.SignalR for .NET
Extra packages are @microsoft/signalr for React
Had to include <script src="https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/7.0.0/signalr.min.js"></script> in index.html for signalr to work
Requirements

Install node.js .net8.0 mysql community server and workbench: workbench is optional, I would watch a video on the server if you don't know about it but maybe thats just mac
You'll want the c# dev kit on vs code
May need to run npm install in the client console.
How to Run

Update database=schema to whatever you called it, user and password in appsetings.json in api
Update local host stuff like port if needed to match what .NET api is running on same thing with inventoryapp.jsx in client

Open terminal for qli003-api dotnet run
open terminal for qli003-client npm start - might have to do npm install first too

Basically once you start the .NET and then go to the API and start that it opens a localhost that currently provides a whole list of the equipment table and you can chose from a dropdown an item youd like the change the description of. The main test of this was to see how to implement real time database changes and how to link up sql - dotnet - react.js
