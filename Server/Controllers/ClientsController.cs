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
    public class ClientsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClientsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Clients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Client>>> GetClients()
        {
            return await _context.Clients.ToListAsync();
        }

        // GET: api/Clients/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SingleClientViewModel>> GetClient(int id)
        {
            var clientEntity = await _context.Clients
                .Include(c => c.Invoices)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (clientEntity == null)
            {
                return NotFound();
            }

            var invoices = clientEntity.Invoices.Select(i => i.Id).ToList();

            var client = new SingleClientViewModel
            {
                Id = clientEntity.Id,
                Name = clientEntity.Name,
                Email = clientEntity.Email,
                PhoneNumber = clientEntity.PhoneNumber,
                InvoicesId = invoices
            };

            return Ok(client);
        }

        // POST: api/Clients
        [HttpPost]
        public async Task<ActionResult<Client>> PostClient(Client client)
        {
            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetClient), new { id = client.Id }, client);
        }

        // PUT: api/Clients/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClient(int id, Client client)
        {
            if (id != client.Id)
            {
                return BadRequest();
            }

            _context.Entry(client).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientExists(id))
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

        // DELETE: api/Clients/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(int id)
        {
            var client = await _context.Clients.FindAsync(id);
            if (client == null)
            {
                return NotFound();
            }

            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClientExists(int id)
        {
            return _context.Clients.Any(e => e.Id == id);
        }

        
        [HttpGet("client-transactions-over-time/{id}")]
        public async Task<IActionResult> GetClientTransactions(int id)
        {
            var data = await _context.Clients
                .Where(c => c.Id == id)
                .SelectMany(c => c.Invoices)
                .GroupBy(i => new { i.DateOfIssue.Year, i.DateOfIssue.Month })
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
                return NotFound("No data available for the specified client.");
            }

            return Ok(data);
        }

        [HttpGet("client-money-spent-over-time/{id}")]
        public async Task<IActionResult> GetClientMoneySpent(int id)
        {
            var data = await _context.Clients
                .Where(c => c.Id == id)
                .SelectMany(c => c.Invoices)
                .GroupBy(i => new { i.DateOfIssue.Year, i.DateOfIssue.Month })
                .OrderBy(g => g.Key.Year)
                .ThenBy(g => g.Key.Month)
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    MoneySpent = g.Sum(i => (double)i.TotalAmount)
                })
                .ToListAsync();

            if (data == null || !data.Any())
            {
                return NotFound("No data available for the specified client.");
            }

            return Ok(data);
        }

        [HttpGet("top-products/{id}")]
        public async Task<IActionResult> GetTopProductsByClient(int id)
        {
            var data = await _context.Clients
                .Where(c => c.Id == id)
                .SelectMany(c => c.Invoices)
                .SelectMany(i => i.InvoiceItems)
                .GroupBy(ii => ii.Product.Name)
                .OrderByDescending(g => g.Sum(ii => ii.Quantity))
                .Take(10)
                .Select(g => new
                {
                    ProductName = g.Key,
                    TotalQuantity = g.Sum(ii => ii.Quantity)
                })
                .ToListAsync();

            if (data == null || !data.Any())
            {
                return NotFound("No data available for the specified client.");
            }

            return Ok(data);
        }
    }
}
