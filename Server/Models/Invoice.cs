using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class Invoice
{
    public int Id { get; set; }
    
    public virtual ICollection<InvoiceItem> InvoiceItems { get; set; } = new List<InvoiceItem>();
    
    public int ClientId { get; set; }
    
    public virtual Client Client { get; set; }

    [Required(ErrorMessage = "Date of issue is required.")]
    public DateTime DateOfIssue { get; set; }

    [Required(ErrorMessage = "Price is required.")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
    public decimal Price { get; set; }

    [Range(0, 1, ErrorMessage = "Discount must be between 0 and 1.")]
    public decimal Discount { get; set; } = 0;

    [Required(ErrorMessage = "Total amount is required.")]
    [Range(0, double.MaxValue, ErrorMessage = "Total amount must be greater than or equal to 0")]
    public decimal TotalAmount { get; set; }

    [Required(ErrorMessage = "Number of products is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "Number of products must be greater than 0.")]
    public int NumberOfProducts { get; set; }

    [Required(ErrorMessage = "Total quantity is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "Total quantity must be greater than 0.")]
    public int TotalQuantity { get; set; }
}
