using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class Client
{
    public int Id { get; set; }
    
    [Required(ErrorMessage = "Name is required.")]
    public string Name { get; set; }
    
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    
    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
}
