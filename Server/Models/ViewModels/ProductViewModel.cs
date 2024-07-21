public class ProductViewModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public DateTime AvailableFrom { get; set; }
    public string Description { get; set; }
    public string ImageURL { get; set; }
    public List<int> invoiceItems { get; set; }
}