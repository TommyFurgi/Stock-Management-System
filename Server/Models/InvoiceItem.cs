using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class InvoiceItem
{
    public int Id { get; set; }

    [ForeignKey("Product")]
    public int ProductId { get; set; }

    [ForeignKey("Invoice")]
    public int InvoiceId { get; set; }

    public virtual Invoice Invoice { get; set; }
    public virtual Product Product { get; set; }

    [Required(ErrorMessage = "Quantity is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0.")]
    public int Quantity { get; set; }

    [Required(ErrorMessage = "Price is required.")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
    public decimal Price { get; set; }
}
