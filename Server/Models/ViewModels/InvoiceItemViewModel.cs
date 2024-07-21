public class InvoiceItemViewModel
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int InvoiceId { get; set; }
    public int ClientId { get; set; }
    public string ClientName { get; set; }
    public DateTime DateOfIssue { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public string ProductName { get; set; }
}

