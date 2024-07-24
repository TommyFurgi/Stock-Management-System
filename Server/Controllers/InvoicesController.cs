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
    public class InvoicesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InvoicesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Invoices
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoicesViewModel>>> GetInvoices()
        {
            var invoices = await _context.Invoices
                .Select(i => new InvoicesViewModel
                {
                    Id = i.Id,
                    ClientName = i.Client.Name,
                    DateOfIssue = i.DateOfIssue,
                    Price = i.Price,
                    Discount = i.Discount,
                    TotalAmount = i.TotalAmount,
                    NumberOfProducts = i.NumberOfProducts,
                    TotalQuantity = i.TotalQuantity
                })
                .ToListAsync();

             return invoices;
        }

        /// GET: api/Invoices/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SingleInvoiceViewModel>> GetInvoice(int id)
        {
            var invoiceEntity = await _context.Invoices
                .Include(i => i.Client) 
                .Include(i => i.InvoiceItems) 
                .FirstOrDefaultAsync(i => i.Id == id);

            if (invoiceEntity == null)
            {
                return NotFound();
            }

            var invoiceItems = new List<int>();

            foreach (InvoiceItem invoiceItem in invoiceEntity.InvoiceItems)
            {
                invoiceItems.Add(invoiceItem.Id);
            }

            var invoice = new SingleInvoiceViewModel
            {
                Id = invoiceEntity.Id,
                ClientId = invoiceEntity.Client.Id,
                DateOfIssue = invoiceEntity.DateOfIssue,
                Price = invoiceEntity.Price,
                Discount = invoiceEntity.Discount,
                TotalAmount = invoiceEntity.TotalAmount,
                NumberOfProducts = invoiceEntity.NumberOfProducts,
                TotalQuantity = invoiceEntity.TotalQuantity,
                InvoiceItems = invoiceItems
            };

            return invoice;
        }

        // POST: api/Invoices
        [HttpPost]
        public async Task<ActionResult<Invoice>> PostInvoice(Invoice invoice)
        {
            invoice.DateOfIssue = DateTime.UtcNow; 
            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInvoice), new { id = invoice.Id }, invoice);
        }

        // PUT: api/Invoices/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInvoice(int id, Invoice invoice)
        {
            if (id != invoice.Id)
            {
                return BadRequest();
            }

            _context.Entry(invoice).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InvoiceExists(id))
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

        // DELETE: api/Invoices/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null)
            {
                return NotFound();
            }

            _context.Invoices.Remove(invoice);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InvoiceExists(int id)
        {
            return _context.Invoices.Any(e => e.Id == id);
        }

        [HttpGet("cumulative-invoices-over-time")]
        public async Task<IActionResult> GetCumulativeInvoicesOverTime()
        {
            var cumulativeData = await _context.Invoices
                .GroupBy(i => new { i.DateOfIssue.Year, i.DateOfIssue.Month })
                .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    CumulativeCount = g.Count()
                })
                .ToListAsync();

            if (cumulativeData == null || !cumulativeData.Any())
            { 
                return NotFound("No data available");
            }

            return Ok(cumulativeData);
        }
        
        [HttpGet("total-profit-over-time")]
        public async Task<IActionResult> GetTotalProfitOverTime()
        {
            var profitData = await _context.Invoices
                .GroupBy(i => new { i.DateOfIssue.Year, i.DateOfIssue.Month })
                .OrderBy(g => g.Key.Year)
                .ThenBy(g => g.Key.Month)
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    TotalProfit = g.Sum(i => (double)i.TotalAmount)
                })
                .ToListAsync();

            if (profitData == null || !profitData.Any())
            {
                return NotFound("No data available");
            }

            return Ok(profitData);
        }
    }
}
