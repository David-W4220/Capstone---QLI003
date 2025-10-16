using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Admins")]
public class Admins
{
    [Key]
    public int ID { get; set; }
    public string? Username { get; set; }
    public string? Password { get; set; }
}