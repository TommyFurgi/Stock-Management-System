using System;
using System.IO;
using OfficeOpenXml;
using Microsoft.Extensions.DependencyInjection;
using Server.Data;
using System.Collections.Generic;
using System.Linq;

public class InvoicesImporter
{
    private readonly IServiceProvider _serviceProvider;

    public InvoicesImporter(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public void ImportInvoices()
    {
        try
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                context.Database.EnsureCreated();

                string invoiceItemsFilePath = "./Data/InvoiceItems.xlsx";
                FileInfo invoiceItemsFileInfo = new FileInfo(invoiceItemsFilePath);

                string invoicesFilePath = "./Data/Invoices.xlsx";
                FileInfo invoicesFileInfo = new FileInfo(invoicesFilePath);

                Dictionary<int, List<InvoiceItem>> invoiceItemsGroupedByInvoiceId = GetDictionaryWithInvoiceItems(invoiceItemsFileInfo, context);

                var invoiceIdCounter = 1;
                using (ExcelPackage package = new ExcelPackage(invoicesFileInfo))
                {
                    ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                    int rowCount = worksheet.Dimension.Rows;

                    for (int row = 2; row <= rowCount; row++)
                    {
                        int clientId = int.TryParse(worksheet.Cells[row, 1].Value?.ToString(), out int q1) ? q1 : 0;
                        decimal discount = decimal.TryParse(worksheet.Cells[row, 2].Value?.ToString(), out decimal q2) ? q2 : 0;

                        if (clientId == 0)
                        {
                            Console.WriteLine($"Skipping row {row} due to missing data (ClientId is empty).");
                            continue;
                        }

                        var invoiceItems = invoiceItemsGroupedByInvoiceId[invoiceIdCounter];
                        var randomDate = GetRandomDate(invoiceItems.Max(item => item.Product.AvailableFrom), new DateTime(2024, 12, 31));
                        var price = invoiceItems.Sum(item => item.Quantity * item.Price);
                        var totalAmount = Math.Round(price - (price * discount), 2);
                        var totalQuantity = invoiceItems.Sum(item => item.Quantity);
                        var numberOfProducts = invoiceItems.Count();

                        var invoice = new Invoice
                        {
                            ClientId = clientId,
                            TotalAmount = totalAmount,
                            DateOfIssue = randomDate,
                            Price = price,
                            Discount = discount,
                            TotalQuantity = totalQuantity,
                            NumberOfProducts = numberOfProducts
                        };
                        
                        var client = context.Clients.FirstOrDefault(p => p.Id == clientId);
                        invoice.Client = client;
                        client.Invoices.Add(invoice);

                        context.Invoices.Add(invoice);

                        foreach (var item in invoiceItems)
                        {
                            item.InvoiceId = invoiceIdCounter;
                            item.Invoice = invoice;
                            invoice.InvoiceItems.Add(item);
                            context.InvoiceItems.Add(item);
                        }

                        invoiceIdCounter++;
                    }

                    context.SaveChanges();
                }
            }

            Console.WriteLine("Data imported successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred while importing data: {ex.Message}");
        }
    }

    private DateTime GetRandomDate(DateTime startDate, DateTime endDate)
    {
        Random rnd = new Random();
        int range = (endDate - startDate).Days;
        return startDate.AddDays(rnd.Next(range));
    }

    private Dictionary<int, List<InvoiceItem>> GetDictionaryWithInvoiceItems(FileInfo invoiceItemsFileInfo, AppDbContext context)
    {
        Dictionary<int, List<InvoiceItem>> invoiceItemsGroupedByInvoiceId = new Dictionary<int, List<InvoiceItem>>();

        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        using (ExcelPackage package = new ExcelPackage(invoiceItemsFileInfo))
        {
            ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
            int rowCount = worksheet.Dimension.Rows;

            for (int row = 2; row <= rowCount; row++)
            {
                int productId = int.TryParse(worksheet.Cells[row, 1].Value?.ToString(), out int q1) ? q1 : 0;
                int quantity = int.TryParse(worksheet.Cells[row, 2].Value?.ToString(), out int q2) ? q2 : 1;
                int invoiceId = int.TryParse(worksheet.Cells[row, 3].Value?.ToString(), out int q3) ? q3 : 0;

                if (productId == 0 || invoiceId == 0)
                {
                    Console.WriteLine($"Skipping row {row} due to missing data (ProductId or InvoiceId is empty).");
                    continue;
                }

                decimal price = context.Products.Where(p => p.Id == productId).Select(p => p.Price).FirstOrDefault();

                var invoiceItem = new InvoiceItem
                {
                    ProductId = productId,
                    Quantity = quantity,
                    Price = price,
                    InvoiceId = invoiceId
                };
                var product = context.Products.FirstOrDefault(p => p.Id == productId);
                invoiceItem.Product = product;
                product.InvoiceItems.Add(invoiceItem);

                if (!invoiceItemsGroupedByInvoiceId.ContainsKey(invoiceId))
                {
                    invoiceItemsGroupedByInvoiceId[invoiceId] = new List<InvoiceItem>();
                }
                invoiceItemsGroupedByInvoiceId[invoiceId].Add(invoiceItem);
            }
        }

        return invoiceItemsGroupedByInvoiceId;
    }
}
