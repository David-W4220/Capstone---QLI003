Leaving this in just for fun\
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

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
Update database=schema to whatever you called it, user and password in appsetings.json in api\
Update local host stuff like port if needed to match what .NET api is running on same thing with inventoryapp.jsx in client

Open terminal for qli003-api  dotnet run\
open terminal for qli003-client npm start - might have to do npm install first too

Basically once you start the .NET and then go to the API and start that it opens a localhost that currently provides a whole list of the equipment table and you can chose from a dropdown an item youd like the change the description of. The main test of this was to see how to implement real time database changes and how to link up sql - dotnet - react.js
