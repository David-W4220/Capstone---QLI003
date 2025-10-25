# Mailing Feature

## New files added
- ReportController.cs (under controllers/)
- services/EmailService.cs

## Requirements
- Packages
`cd qli003-api
dotnet add package MailKit
dotnet add package QuestPDF`

- Install Papercut SMTP

- Register new mail service in Program.cs by adding this line 
`builder.Services.AddScoped<qli003_api.Services.EmailService>();`
BEFORE `builder.WebHost.UseUrls("http://0.0.0.0:5097");`

- Configure SMTP in appsettings.json
`"SMTP": {
  "Host": "localhost",
  "Port": 25,
  "Username": "",
  "Password": ""
}`

## How to run:
1. Do `dotnet run`, open [Swagger UI](http://localhost:5097/swagger/index.html), find Report's POST /api/Report/send, click "Try it out" and then "Execute". You should see a `{ "message": "Report sent successfully."}` in the Response body beneath.
2. Go to Papercut SMTP UI, the plain text message should be viewable under "message" while "Headers" should contain other mail info. As for the pdf report, right click, save as to view it locally if you cant open it directly under "Sections" 

## Notes
In future this should link to frontend react which should add a button to generate such mail instead of swagger.