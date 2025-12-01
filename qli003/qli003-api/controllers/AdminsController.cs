using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using System.Linq; 
using System.ComponentModel.DataAnnotations; // Needed for the inline model

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

    // =====================================================================
    // NEW: LOGIN ENDPOINT
    // =====================================================================
    /// <summary>
    /// Authenticates an administrator based on username and password.
    /// Route: POST api/Admins/login
    /// </summary>
    [HttpPost("login")]
    // NOTE: References the model defined at the bottom of this file
    public async Task<IActionResult> Login([FromBody] AdminLoginModel model)
    {
        // 🚨 SECURITY WARNING: This method performs a plain text password comparison 
        // which is INSECURE for production use.
        
        if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password))
        {
            return BadRequest("Username and password are required.");
        }

        // 1. Search the Admins table for a matching username and password
        var admin = await _context.Admins
            .AsNoTracking() // Read-only query for performance
            .FirstOrDefaultAsync(a => a.Username == model.Username && a.Password == model.Password);

        if (admin == null)
        {
            // 2. Failure: If no match is found, return 401 Unauthorized
            return Unauthorized("Invalid username or password.");
        }

        // 3. Success: If a match is found, return 200 OK with sanitized admin data
        return Ok(new 
        {
            Id = admin.ID,
            Username = admin.Username
        });
    }

    // =====================================================================
    // EXISTING CRUD OPERATIONS
    // =====================================================================
    
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

// =====================================================================
// NEW: INLINE LOGIN MODEL (Fixes CS0246 error by placing it in the same file/namespace)
// =====================================================================
public class AdminLoginModel
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}