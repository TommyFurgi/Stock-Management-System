using System;
using System.IO;
using OfficeOpenXml;
using Microsoft.Extensions.DependencyInjection;
using Server.Data;
using System.Collections.Generic;
using System.Linq;

public class ProductsImporter
{
    private readonly IServiceProvider _serviceProvider;

    public ProductsImporter(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public void ImportProducts()
    {
        try
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                context.Database.EnsureCreated();

                string excelFilePath = "./Data/Products.xlsx";
                FileInfo fileInfo = new FileInfo(excelFilePath);

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial; 
                using (ExcelPackage package = new ExcelPackage(fileInfo))
                {
                    ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                    int rowCount = worksheet.Dimension.Rows;

                    for (int row = 2; row <= rowCount; row++)
                    {

                        string name = worksheet.Cells[row, 1].Value?.ToString();
                        int quantity = int.TryParse(worksheet.Cells[row, 2].Value?.ToString(), out int q) ? q : 0;
                        decimal price = decimal.TryParse(worksheet.Cells[row, 3].Value?.ToString(), out decimal p) ? p : 0;
                        DateTime availableFrom = DateTime.TryParse(worksheet.Cells[row, 4].Value?.ToString(), out DateTime af) ? af : DateTime.MinValue;
                        string description = worksheet.Cells[row, 5].Value?.ToString() ?? string.Empty; 
                        string imageURL = worksheet.Cells[row, 6].Value?.ToString() ?? string.Empty; 


                        if (string.IsNullOrEmpty(name))
                        {
                            Console.WriteLine($"Skipping row {row} due to missing data (Name is empty).");
                            continue;
                        }

                        var product = new Product
                        {
                            Name = name,
                            Quantity = quantity,
                            Price = price,
                            AvailableFrom = availableFrom,
                            Description = description,
                            ImageURL = imageURL
                        };

                        context.Products.Add(product);
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

}