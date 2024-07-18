using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class Client
{
    public int Id { get; set; }
    
    [Required(ErrorMessage = "Name is required.")]
    public string Name { get; set; }
    
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    
    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
}
