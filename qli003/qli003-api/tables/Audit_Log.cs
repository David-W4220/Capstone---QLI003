using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Audit_Log")]
public class Audit_Log
{
    [Key]
    public int ID { get; set; }
    public int Admin_ID { get; set; } //F key
    public string? Act_Description { get; set; }
    public DateTime Timestamp { get; set; }
}