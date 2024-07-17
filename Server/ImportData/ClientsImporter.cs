using System;
using System.IO;
using OfficeOpenXml;
using Microsoft.Extensions.DependencyInjection;
using Server.Data;
using System.Collections.Generic;
using System.Linq;

public class ClientsImporter
{
    private readonly IServiceProvider _serviceProvider;

    public ClientsImporter(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public void ImportClients()
    {
        try
        {
            using (var scope = _serviceProvider.CreateScope())
            {

                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
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
            }

            Console.WriteLine("Data imported successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred while importing data: {ex.Message}");
        }
    }

}