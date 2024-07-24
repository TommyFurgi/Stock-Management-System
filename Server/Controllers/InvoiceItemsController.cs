using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceItemsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InvoiceItemsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/InvoiceItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoiceItem>>> GetInvoiceItems()
        {
            return await _context.InvoiceItems.ToListAsync();
        }

        // GET: api/InvoiceItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceItemViewModel>> GetInvoiceItem(int id)
        {
            var itemEntity = await _context.InvoiceItems
                .Include(p => p.Product)
                .Include(i => i.Invoice)
                .ThenInclude(c => c.Client)
                .FirstOrDefaultAsync(p => p.Id == id);
            
            if (itemEntity == null)
            {
                return NotFound();
            }

            var item = new InvoiceItemViewModel
            {
                Id = itemEntity.Id,
                ProductId = itemEntity.ProductId,
                InvoiceId = itemEntity.InvoiceId,
                ClientId = itemEntity.Invoice.Client.Id,
                ClientName = itemEntity.Invoice.Client.Name,
                DateOfIssue = itemEntity.Invoice.DateOfIssue,
                Quantity = itemEntity.Quantity,
                Price = itemEntity.Price,
                ProductName = itemEntity.Product.Name
            };

            return Ok(item);
        }

        // POST: api/InvoiceItems
        [HttpPost]
        public async Task<ActionResult<InvoiceItem>> PostInvoiceItem(InvoiceItem invoiceItem)
        {
            _context.InvoiceItems.Add(invoiceItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInvoiceItem), new { id = invoiceItem.Id }, invoiceItem);
        }

        // PUT: api/InvoiceItems/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInvoiceItem(int id, InvoiceItem invoiceItem)
        {
            if (id != invoiceItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(invoiceItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InvoiceItemExists(id))
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

        // DELETE: api/InvoiceItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoiceItem(int id)
        {
            var invoiceItem = await _context.InvoiceItems.FindAsync(id);
            if (invoiceItem == null)
            {
                return NotFound();
            }

            _context.InvoiceItems.Remove(invoiceItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InvoiceItemExists(int id)
        {
            return _context.InvoiceItems.Any(e => e.Id == id);
        }

        [HttpGet("top-sellers")]
        public async Task<IActionResult> GetTopSellingProducts()
        {
            var topSellingProducts = await _context.InvoiceItems
                .GroupBy(ii => ii.ProductId)
                .Select(g => new
                {
                    Quantity = g.Sum(ii => ii.Quantity),
                    ProductName = g.First().Product.Name
                })
                .OrderByDescending(p => p.Quantity)
                .Take(8)
                .ToListAsync();

            if (topSellingProducts == null || !topSellingProducts.Any())
            {
                return NotFound("No data available");
            }

            return Ok(topSellingProducts);
        }

        [HttpGet("top-income")]
        public async Task<IActionResult> GetTopIncomeProducts()
        {
            var topProfitableProducts = await _context.InvoiceItems
                .GroupBy(ii => ii.ProductId)
                .Select(g => new
                {
                    Income = g.Sum(ii => (double)ii.Quantity * (double)ii.Price),
                    ProductName = g.First().Product.Name
                })
                .OrderByDescending(p => p.Income)
                .Take(10)
                .ToListAsync();

            if (topProfitableProducts == null || !topProfitableProducts.Any())
            {
                return NotFound("No data available");
            }

            return Ok(topProfitableProducts);
        }

        [HttpGet("items-prices/{invoiceId}")]
        public async Task<IActionResult> GetItemsPrices(int invoiceId)
        {
            var items = await _context.InvoiceItems
                .Include(p => p.Product)
                .Where(i => i.InvoiceId == invoiceId)
                .Select(g => new
                {
                    ProductName = g.Product.Name,
                    Price = g.Price
                })
                .ToListAsync();

            if (items == null || !items.Any())
            {
                return NotFound("No items found for the specified invoice");
            }

            var sortedItems = items.OrderByDescending(i => i.Price).ToList();

            return Ok(sortedItems);
        }

    }
}
