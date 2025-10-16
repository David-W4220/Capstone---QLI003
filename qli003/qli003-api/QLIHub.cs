using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

public class QLIHub : Hub
{
    public async Task SendRefreshSignal()
    {
        await Clients.All.SendAsync("RefreshData");
    }
}