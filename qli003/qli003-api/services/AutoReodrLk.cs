using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;

public class AutoReodrLk : BackgroundService
{
    
    //<AddScoped Setting>
    //Replace direct DBContext injection with IServiceScopeFactory(Singleton)
    //private readonly QLIDbContext _context;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IConfiguration _config;
    private readonly IHubContext<QLIHub> _hubContext;
    //private readonly TimeSpan _interval = TimeSpan.FromDays(7);// <- EDIT RESENT INTERVAL BY DAYS HERE
    private readonly TimeSpan _interval = TimeSpan.FromSeconds(45); // test interval: FromSeconds(30)

    //public AutoReodrLk(QLIDbContext context, IConfiguration config)
    public AutoReodrLk(IServiceScopeFactory scopeFactory, IConfiguration config, IHubContext<QLIHub> hubContext)
    {
        //<AddScoped Setting>
        //_context = context;
        _scopeFactory = scopeFactory; // Store the factory
        _config = config;
        _hubContext = hubContext;
    }

    //backend looping entry
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await SendLowStockReportAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AutoReodrLk Error] {ex.GetType().Name}: {ex.Message}");
            }

            // Sleep 7 days
            await Task.Delay(_interval, stoppingToken);
        }
    }

    public async Task<bool> SendLowStockReportAsync()
    {
        //make a new scope than resolve the DBcontext from it.
        using var scope = _scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<QLIDbContext>(); //"context" instead of "_context" now        
        // Fetch newest equipment state
        var items = await context.Equipment.AsNoTracking().ToListAsync();

        //<AddScoped Setting>
        // Fetch newest equipment state
        //var items = await _context.Equipment.AsNoTracking().ToListAsync();

        //sum a low/out-of-stock list
        var lowList = items
            .Where(e => e.Item_Cnt <= e.Threshold)
            .ToList();

        //skip sending If nothing below threshold,
        if (lowList.Count == 0)
        {
            Console.WriteLine("[AutoReodrLk] Scan complete. No items are below threshold. No email sent.");
            
            await _hubContext.Clients.All.SendAsync("AutoReorderStatus", new { type = "success", message = "Auto scan complete. No items are below threshold. No email sent." });

            return false;
        }

        //build email
        var message = new MimeMessage();
        message.Subject = "Low/out of Stock Item Report";
        message.From.Add(new MailboxAddress("QLI System", "no-reply@qli003.local"));
        message.To.Add(new MailboxAddress("Test Receiver", "test@localhost"));

        //create a HTML table
        var htmlTable = "<br><table border='1' cellpadding='6' cellspacing='0' style='border-collapse:collapse; width: 100%; table-layout: fixed;'>"
              + "<tr><th style='width: 10%;'>Index</th>"
              + "<th style='width: 25%;'>Item Name</th>"
              + "<th style='width: 55%;'>Suggested Reordering Link</th>" 
              + "<th style='width: 10%;'>Buy Quantity</th></tr>";

        int index = 1;
        foreach (var e in lowList)
        {
            htmlTable +=
                $"<tr><td>{index}</td>" +
                $"<td>{e.Name}</td>" +
                $"<td style='word-break: break-all;'>" + //display "Not Available Yet" or a clickable link
                $"{(string.IsNullOrEmpty(e.ReodrLk_Pri_Qty) ? "Not Available Yet" : $"<a href='{e.ReodrLk_Pri_Qty}'>{e.ReodrLk_Pri_Qty}</a>")}" +
                $"<td>{e.BuyQty}</td></tr>";
            index++;
        }

        htmlTable += "</table>";

        //combine message
        var bodyText =@"Here are suggest reorder links for items that require attention for its stock level:
";

        var body = new TextPart("html")
        {
            Text = $"{bodyText}{htmlTable}<br><br>Please take action soon!"
        };

        message.Body = body;

        //send mail to Papercut
        try
        {
            using var client = new SmtpClient();
            await client.ConnectAsync("localhost", 25, MailKit.Security.SecureSocketOptions.None);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            Console.WriteLine("[AutoReodrLk] Reorder email sent successfully.");
            
            //for AutoReorder's UI Feedback
            await _hubContext.Clients.All.SendAsync("AutoReorderStatus", new { type = "success", message = "Auto reorder email sent successfully." });            
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Mailing Error！] {ex.GetType().Name}: {ex.Message}");
            Console.WriteLine(ex.StackTrace);

            await _hubContext.Clients.All.SendAsync("AutoReorderStatus",new { type = "error", message = $"Auto reorder mailing failed! ERROR: {ex.Message}" });
            throw new InvalidOperationException($"Email sending failed. Error: {ex.Message}", ex);
        }
    }
}
