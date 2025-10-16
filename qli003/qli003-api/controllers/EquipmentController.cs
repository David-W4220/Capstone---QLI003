
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

//http://localhost:5097/api/Equipment

[Route("api/[controller]")]
[ApiController]
public class EquipmentController : ControllerBase
{
    private readonly QLIDbContext _context;
    private readonly IHubContext<QLIHub> _hubContext;

    public EquipmentController(QLIDbContext context, IHubContext<QLIHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Equipment>>> GetEquipment()
    {
        return await _context.Equipment.ToListAsync();
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddEquipment([FromBody] Equipment newEquipment)
    {
        _context.Equipment.Add(newEquipment);
        await _context.SaveChangesAsync();

        await _hubContext.Clients.All.SendAsync("RefreshData");

        return Ok(newEquipment);
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateEquipment(int id, [FromBody] Equipment updatedEquipment)
    {
        if (id != updatedEquipment.ID)
        {
            return BadRequest();
        }

        _context.Entry(updatedEquipment).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        await _hubContext.Clients.All.SendAsync("RefreshData");
        return NoContent();
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteEquipment(int id)
    {
        var equipment = await _context.Equipment.FindAsync(id);
        if (equipment == null)
        {
            return NotFound();
        }

        _context.Equipment.Remove(equipment);
        await _context.SaveChangesAsync();
        await _hubContext.Clients.All.SendAsync("RefreshData");
        return NoContent();
    }
}