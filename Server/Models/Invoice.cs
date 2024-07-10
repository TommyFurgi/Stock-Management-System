using System.Collections.Generic;

public class Invoice
{
    public int Id { get; set; }

    public DateTime Date { get; set; } 
    
    public virtual ICollection<InvoiceItem> InvoiceItems { get; set; } = new List<InvoiceItem>();
    
    public int ClientId { get; set; }
    
    public virtual Client Client { get; set; }
}
