using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class Product
{
    public int Id { get; set; }
    
    [Required(ErrorMessage = "Name is required.")]
    public string Name { get; set; }
    
    [Required(ErrorMessage = "Quantity is required.")]
    [Range(0, double.MaxValue, ErrorMessage = "Quantity must be greater than or equal 0.")]
    public int Quantity { get; set; }
    
    [Required(ErrorMessage = "Price is required.")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "Available date is required.")]
    public DateTime AvailableFrom { get; set; }

    public string Description { get; set; }

    public string ImageURL { get; set; }

    public virtual ICollection<InvoiceItem> InvoiceItems { get; set; } = new List<InvoiceItem>();
}
