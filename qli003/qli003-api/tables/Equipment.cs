using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Equipment")]
public class Equipment
{
    [Key]
    public int ID { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public int Threshold { get; set; }
    public string? ReodrLk_Pri_Qty { get; set; }
    public string? BuyQty { get; set; }
}