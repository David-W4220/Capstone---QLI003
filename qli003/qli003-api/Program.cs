using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSignalR();

// Add Swagger services.
// http://localhost:5097/swagger/index.html
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add services to the container
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<QLIDbContext>(options =>
    options.UseMySQL(connectionString!)
    );

// Add controllers and JSON serialization
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

// Add CORS policy to allow requests from React app (IMPORTANT FOR SIGNALR)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            //policy.WithOrigins("http://localhost:3000", "http://127.0.0.1:3000") 
            //Allows connections from any  origin on the network
            policy.SetIsOriginAllowed(_=> true)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // REQUIRED for SignalR
        });
});


//Register new mail service
builder.Services.AddScoped<EmailService>();

//Tells the application to listen to all IPs on this port
builder.WebHost.UseUrls("http://0.0.0.0:5097");
var app = builder.Build();

// Configure the HTTP request pipeline.
// Enable Swagger only in development mode
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

// CORS must be here, before UseRouting/MapControllers
app.UseCors(); 

app.UseRouting();

app.UseAuthorization();

app.MapControllers();

app.MapHub<QLIHub>("/qliHub");

app.Run();