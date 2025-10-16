
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

//http://localhost:5097/api/Auditlog

[Route("api/[controller]")]
[ApiController]
public class AuditlogController : ControllerBase
{
    private readonly QLIDbContext _context;
    private readonly IHubContext<QLIHub> _hubContext;

    public AuditlogController(QLIDbContext context, IHubContext<QLIHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Audit_Log>>> GetAuditlog()
    {
        return await _context.Audit_Log.ToListAsync();
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddAuditlog([FromBody] Audit_Log newAuditlog)
    {
        _context.Audit_Log.Add(newAuditlog);
        await _context.SaveChangesAsync();

        await _hubContext.Clients.All.SendAsync("RefreshData");

        return Ok(newAuditlog);
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateAuditLog(int id, [FromBody] Audit_Log updatedAuditLog)
    {
        if (id != updatedAuditLog.ID)
        {
            return BadRequest();
        }

        _context.Entry(updatedAuditLog).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        await _hubContext.Clients.All.SendAsync("RefreshData");
        return NoContent();
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteAuditLog(int id)
    {
        var auditlog = await _context.Audit_Log.FindAsync(id);
        if (auditlog == null)
        {
            return NotFound();
        }

        _context.Audit_Log.Remove(auditlog);
        await _context.SaveChangesAsync();
        await _hubContext.Clients.All.SendAsync("RefreshData");
        return NoContent();
    }
}