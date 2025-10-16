
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

//http://localhost:5097/api/TransactionLog

[Route("api/[controller]")]
[ApiController]
public class TransactionLogController : ControllerBase
{
    private readonly QLIDbContext _context;
    private readonly IHubContext<QLIHub> _hubContext;

    public TransactionLogController(QLIDbContext context, IHubContext<QLIHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transaction_Log>>> GetTransactionLog()
    {
        return await _context.Transaction_Log.ToListAsync();
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddTransactionLog([FromBody] Transaction_Log newTransactionLog)
    {
        _context.Transaction_Log.Add(newTransactionLog);
        await _context.SaveChangesAsync();

        await _hubContext.Clients.All.SendAsync("RefreshData");

        return Ok(newTransactionLog);
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateTransactionLog(int id, [FromBody] Transaction_Log updatedTransactionLog)
    {
        if (id != updatedTransactionLog.ID)
        {
            return BadRequest();
        }

        _context.Entry(updatedTransactionLog).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        await _hubContext.Clients.All.SendAsync("RefreshData");
        return NoContent();
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteTransactionLog(int id)
    {
        var TransactionLog = await _context.Transaction_Log.FindAsync(id);
        if (TransactionLog == null)
        {
            return NotFound();
        }

        _context.Transaction_Log.Remove(TransactionLog);
        await _context.SaveChangesAsync();
        await _hubContext.Clients.All.SendAsync("RefreshData");
        return NoContent();
    }
}