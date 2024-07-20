public class SingleInvoiceViewModel
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    public DateTime DateOfIssue { get; set; }
    public decimal Price { get; set; }
    public decimal Discount { get; set; }
    public decimal TotalAmount { get; set; }
    public int NumberOfProducts { get; set; }
    public int TotalQuantity { get; set; }
    public virtual List<int> InvoiceItems { get; set; } = new List<int>();
}