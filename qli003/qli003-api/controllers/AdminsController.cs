
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

//http://localhost:5097/api/Admins

[Route("api/[controller]")]
[ApiController]
public class AdminsController : ControllerBase
{
    private readonly QLIDbContext _context;
    private readonly IHubContext<QLIHub> _hubContext;

    public AdminsController(QLIDbContext context, IHubContext<QLIHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Admins>>> GetAdmins()
    {
        return await _context.Admins.ToListAsync();
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddAdmins([FromBody] Admins newAdmins)
    {
        _context.Admins.Add(newAdmins);
        await _context.SaveChangesAsync();

        await _hubContext.Clients.All.SendAsync("RefreshData");

        return Ok(newAdmins);
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateAdmins(int id, [FromBody] Admins updatedAdmins)
    {
        if (id != updatedAdmins.ID)
        {
            return BadRequest();
        }

        _context.Entry(updatedAdmins).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        await _hubContext.Clients.All.SendAsync("RefreshData");
        return NoContent();
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteAdmins(int id)
    {
        var admins = await _context.Admins.FindAsync(id);
        if (admins == null)
        {
            return NotFound();
        }

        _context.Admins.Remove(admins);
        await _context.SaveChangesAsync();
        await _hubContext.Clients.All.SendAsync("RefreshData");
        return NoContent();
    }
}