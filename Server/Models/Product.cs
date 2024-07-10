using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class Product
{
    public int Id { get; set; }
    
    [Required(ErrorMessage = "Name is required.")]
    public string Name { get; set; }
    
    [Required(ErrorMessage = "Quantity is required.")]
    public int Quantity { get; set; }
    
    [Required(ErrorMessage = "Price is required.")]
    public float Price { get; set; }
    
    public virtual ICollection<InvoiceItem> InvoiceItems { get; set; } = new List<InvoiceItem>();
}
