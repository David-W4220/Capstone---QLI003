using Microsoft.EntityFrameworkCore;

public class QLIDbContext : DbContext
{
    public QLIDbContext(DbContextOptions<QLIDbContext> options) : base(options) { }

    public DbSet<Equipment> Equipment { get; set; }
    public DbSet<Admins> Admins { get; set; }
    public DbSet<Audit_Log> Audit_Log { get; set; }
    public DbSet<Transaction_Log> Transaction_Log { get; set; }

}