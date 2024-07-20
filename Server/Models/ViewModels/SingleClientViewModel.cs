public class SingleClientViewModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public List<int> InvoicesId { get; set; } = new List<int>();
}
