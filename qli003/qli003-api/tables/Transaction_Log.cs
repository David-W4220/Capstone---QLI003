using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


[Table("Transaction_Log")]
public class Transaction_Log
{
    [Key]
    public int ID { get; set; }

    [ForeignKey("Equipment")]
    public int Equipment_ID { get; set; } 

    public bool Check_In { get; set; }
    public int Quantity_Changed { get; set; }
    public DateTime Timestamp { get; set; }
    public string? Optional_Notes { get; set; }
}