using Microsoft.EntityFrameworkCore;

public class QLIDbContext : DbContext
{
    public QLIDbContext(DbContextOptions<QLIDbContext> options) : base(options) { }

    public DbSet<Equipment> Equipment { get; set; }
    public DbSet<Admins> Admins { get; set; }
    public DbSet<Inventory> Inventory { get; set; }
    public DbSet<Audit_Log> Audit_Log { get; set; }
    public DbSet<Transaction_Log> Transaction_Log { get; set; }

    //Tell EF Core to store and read the enum as a string for Transaction_Logs
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Transaction_Log>()
        .Property(t => t.Condition)
        .HasConversion<string>(); // <-- maps enum to string in DB
    }
}