using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public enum Condition
{
    Good,
    Needs_Repair,
    Broken
}


[Table("Transaction_Log")]
public class Transaction_Log
{
    [Key]
    public int ID { get; set; }
    public int Inventory_ID { get; set; } //F key
    public bool Check_In { get; set; }
    public int Quantity_Changed { get; set; }
    public DateTime Timestamp { get; set; }
    public Condition Condition { get; set; }
    public string? Optional_Notes { get; set; }
}