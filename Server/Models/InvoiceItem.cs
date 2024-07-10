using System.ComponentModel.DataAnnotations.Schema;

public class InvoiceItem
{
    public int Id { get; set; }
    
    public int ProductId { get; set; }
    public int InvoiceId { get; set; }
    
    public virtual Invoice Invoice { get; set; }
    public virtual Product Product { get; set; }
    
    public int Quantity { get; set; }
}
