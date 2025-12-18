using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

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

    // GET: api/Equipment
    // Modified to only return items that are NOT soft-deleted
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Equipment>>> GetEquipment()
    {
        return await _context.Equipment
            .Where(e => !e.IsDeleted)
            .ToListAsync();
    }

    // POST: api/Equipment/add
    [HttpPost("add")]
    public async Task<IActionResult> AddEquipment([FromBody] Equipment newEquipment)
    {
        // RESTORE LOGIC: Check if an item with this name was previously "deleted"
        var existingDeleted = await _context.Equipment
            .FirstOrDefaultAsync(e => e.Name == newEquipment.Name && e.IsDeleted);

        if (existingDeleted != null)
        {
            // Instead of a new row, we "undelete" and update the old one
            existingDeleted.IsDeleted = false;
            existingDeleted.Item_Cnt = newEquipment.Item_Cnt;
            existingDeleted.Alpha_Loc = newEquipment.Alpha_Loc;
            existingDeleted.Description = newEquipment.Description;
            existingDeleted.Threshold = newEquipment.Threshold;
            
            _context.Entry(existingDeleted).State = EntityState.Modified;
        }
        else
        {
            _context.Equipment.Add(newEquipment);
        }

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

        equipment.IsDeleted = true;
        
        _context.Entry(equipment).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        
        await _hubContext.Clients.All.SendAsync("RefreshData");
        return NoContent();
    }
}