using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Inventory")]
public class Inventory
{
    [Key]
    public int ID { get; set; }
    public int Equipment_ID { get; set; } //F key
    public string? Alpha_Loc { get; set; }
    public int Good_Cnt { get; set; }
    public int Need_Repair_Cnt { get; set; }
    public int Broken_Cnt { get; set; }
}