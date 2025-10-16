
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

//http://localhost:5097/api/Inventory

[Route("api/[controller]")]
[ApiController]
public class InventoryController : ControllerBase
{
    private readonly QLIDbContext _context;
    private readonly IHubContext<QLIHub> _hubContext;

    public InventoryController(QLIDbContext context, IHubContext<QLIHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Inventory>>> GetInventory()
    {
        return await _context.Inventory.ToListAsync();
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddInventory([FromBody] Inventory newInventory)
    {
        _context.Inventory.Add(newInventory);
        await _context.SaveChangesAsync();

        await _hubContext.Clients.All.SendAsync("RefreshData");

        return Ok(newInventory);
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateInventory(int id, [FromBody] Inventory updatedInventory)
    {
        if (id != updatedInventory.ID)
        {
            return BadRequest();
        }

        _context.Entry(updatedInventory).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        await _hubContext.Clients.All.SendAsync("RefreshData");
        return NoContent();
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteInventory(int id)
    {
        var inventory = await _context.Inventory.FindAsync(id);
        if (inventory == null)
        {
            return NotFound();
        }

        _context.Inventory.Remove(inventory);
        await _context.SaveChangesAsync();
        await _hubContext.Clients.All.SendAsync("RefreshData");
        return NoContent();
    }
}