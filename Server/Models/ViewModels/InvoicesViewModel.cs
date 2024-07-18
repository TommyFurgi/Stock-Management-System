public class InvoicesViewModel
{
    public int Id { get; set; }
    public string ClientName { get; set; }
    public DateTime DateOfIssue { get; set; }
    public decimal Price { get; set; }
    public decimal Discount { get; set; }
    public decimal TotalAmount { get; set; }
    public int NumberOfProducts { get; set; }
    public int TotalQuantity { get; set; }
}