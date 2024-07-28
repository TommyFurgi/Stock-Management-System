using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Globalization;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductViewModel>> GetProduct(int id)
        {
            var productEntity = await _context.Products
                .Include(i => i.InvoiceItems)
                .FirstOrDefaultAsync(i => i.Id == id);
            
            if (productEntity == null)
            {
                return NotFound();
            }

            var items = productEntity.InvoiceItems.Select(i => i.Id).ToList();

            var product = new ProductViewModel
            {
                Id = productEntity.Id,
                Name = productEntity.Name,
                Quantity = productEntity.Quantity,
                Price = productEntity.Price,
                AvailableFrom = productEntity.AvailableFrom,
                Description = productEntity.Description,
                ImageURL = productEntity.ImageURL,
                invoiceItems = items
            };

            return Ok(product);
        }

        // POST: api/Products
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        // PUT: api/Products/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest();
            }

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }

        [HttpGet("max-values")]
        public async Task<IActionResult> GetMaxValues()
        {
            var maxPrice = await _context.Products.MaxAsync(p => (double)p.Price);
            var maxQuantity = await _context.Products.MaxAsync(p => (int)p.Quantity);

            return Ok(new { MaxPrice = maxPrice, MaxQuantity = maxQuantity });
        }
        
        [HttpGet("quantity-over-time")]
        public async Task<IActionResult> GetQuantityOverTime()
        {
            var data = await _context.Products
                .GroupBy(p => new { p.AvailableFrom.Year, p.AvailableFrom.Month })
                .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Count = g.Count()
                })
                .ToListAsync();

            if (data == null || !data.Any())
            {
                return NotFound("No data available");
            }

            int cumulativeQuantity = 0;
            var cumulativeData = data.Select(d => new
            {
                Year = d.Year,
                Month = d.Month,
                CumulativeQuantity = (cumulativeQuantity += d.Count)
            }).ToList();

            return Ok(cumulativeData);
        }

        [HttpGet("product-transactions-over-time/{id}")]
        public async Task<IActionResult> GetProductTransactions(int id)
        {
            var data = await _context.Products
                .Where(p => p.Id == id)
                .SelectMany(p => p.InvoiceItems)
                .GroupBy(ii => new { ii.Invoice.DateOfIssue.Year, ii.Invoice.DateOfIssue.Month })
                .OrderBy(g => g.Key.Year)
                .ThenBy(g => g.Key.Month)
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    TransactionCount = g.Count()
                })
                .ToListAsync();

            if (data == null || !data.Any())
            {
                return NotFound("No data available");
            }

            return Ok(data);
        }

        [HttpGet("product-profit-over-time/{id}")]
        public async Task<IActionResult> GetProductProfitOverTime(int id)
        {
            var data = await _context.Products
                .Where(p => p.Id == id)
                .SelectMany(p => p.InvoiceItems)
                .GroupBy(ii => new { Year = ii.Invoice.DateOfIssue.Year, Month = ii.Invoice.DateOfIssue.Month })
                .OrderBy(g => g.Key.Year)
                .ThenBy(g => g.Key.Month)
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    TotalProfit = g.Sum(ii => (double)ii.Quantity * (double)ii.Price) 
                })
                .ToListAsync();

            if (data == null || !data.Any())
            {
                return NotFound("No data available");
            }

            return Ok(data);
        }

        [HttpGet("product-purchase-quantity-by-client/{productId}")]
        public async Task<IActionResult> GetProductPurchaseQuantityByClient(int productId)
        {
            var data = await _context.Invoices
                .SelectMany(i => i.InvoiceItems)
                .Where(ii => ii.Product.Id == productId)
                .GroupBy(ii => new { ii.Invoice.Client.Id, ii.Invoice.Client.Name })
                .Select(g => new
                {
                    ClientId = g.Key.Id,
                    ClientName = g.Key.Name,
                    TotalQuantity = g.Sum(ii => ii.Quantity)
                })
                .OrderByDescending(g => g.TotalQuantity)
                .ToListAsync();

            if (data == null || !data.Any())
            {
                return NotFound("No data available for this product");
            }

            return Ok(data);
        }

        [HttpPut("increase-product-quantity-by/{id}")]
        public async Task<IActionResult> IncreaseProductQuantityBy(int id, [FromBody] int newQuantity)
        {
            if (newQuantity < 0)
            {
                return BadRequest("Quantity to increase must be a positive number.");
            }

            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            product.Quantity += newQuantity;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

    }
}
