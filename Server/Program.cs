using System;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OfficeOpenXml;
using Server.Data;

public class Program
{
    public static void Main(string[] args)
    {
        var host = CreateHostBuilder(args).Build();
        // ImportClients(host);
        // ImportProducts(host);
        host.Run();
    }

    private static void ImportClients(IHost host)
    {
        using (var scope = host.Services.CreateScope())
        {
            var services = scope.ServiceProvider;

            try
            {
                var context = services.GetRequiredService<AppDbContext>();
                context.Database.EnsureCreated();

                string excelFilePath = "./Data/Clients.xlsx";
                FileInfo fileInfo = new FileInfo(excelFilePath);

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using (ExcelPackage package = new ExcelPackage(fileInfo))
                {
                    ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                    int rowCount = worksheet.Dimension.Rows;

                    for (int row = 1; row <= rowCount; row++)
                    {
                        string name = worksheet.Cells[row, 1].Value?.ToString();
                        string email = worksheet.Cells[row, 2].Value?.ToString();
                        string phoneNumber = worksheet.Cells[row, 3].Value?.ToString();

                        if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(phoneNumber))
                        {
                            Console.WriteLine($"Skipping row {row} due to missing data (Name, Email or PhoneNumber is empty).");
                            continue;
                        }

                        var client = new Client
                        {
                            Name = name,
                            Email = email,
                            PhoneNumber = phoneNumber
                        };

                        context.Clients.Add(client);
                    }
                    context.SaveChanges();
                }
                Console.WriteLine("Data imported successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while importing data: {ex.Message}");
            }
        }
    }

    private static void ImportProducts(IHost host)
    {
        using (var scope = host.Services.CreateScope())
        {
            var services = scope.ServiceProvider;

            try
            {
                var context = services.GetRequiredService<AppDbContext>();
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
                Console.WriteLine("Data imported successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while importing data: {ex.Message}");
            }
        }
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            });
}

