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
        
        // Remove this comment on first run to import data into the database
        // ImportData(host);
        
        host.Run();
    }

    
    private static void ImportData(IHost host)
    {
        using (var scope = host.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            
            try
            {
                var clientsImporter = services.GetRequiredService<ClientsImporter>();
                clientsImporter.ImportClients();

                var productsImporter = services.GetRequiredService<ProductsImporter>();
                productsImporter.ImportProducts();

                var invoicesImporter = services.GetRequiredService<InvoicesImporter>();
                invoicesImporter.ImportInvoices();

                Console.WriteLine("Data import process completed.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
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
