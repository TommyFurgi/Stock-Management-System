import random
from openpyxl import Workbook

def generate_invoice_items(num_items, num_invoices):
    invoice_items = []
    
    # ensure that every Invoice contains at least one InvoiceItem
    for invoice_id in range(1, num_invoices + 1):
        product_id = random.randint(1, 84)
        quantity = random.randint(1, 10)   
        invoice_items.append((product_id, quantity, invoice_id))

    # generate rest of InvoiceItems
    remaining_items = num_items - num_invoices
    for _ in range(remaining_items):
        product_id = random.randint(1, 84)
        quantity = random.randint(1, 10)
        invoice_id = random.randint(1, num_invoices)
        invoice_items.append((product_id, quantity, invoice_id))
    
    return invoice_items
    # return shuffle_columns(invoice_items, num_items)

# def shuffle_columns(invoice_items, num_items):
#     for _ in range(num_items * 2):
#         random_pos1 = random.randint(0, num_items-1)
#         random_pos2 = random.randint(0, num_items-1)
#         invoice_items[random_pos1], invoice_items[random_pos2] = invoice_items[random_pos2], invoice_items[random_pos1]

#     return invoice_items

def save_to_excel(invoice_items):
    wb = Workbook()
    ws = wb.active
    ws.append(["ProductId", "Quantity", "InvoiceId"]) 

    for item in invoice_items:
        ws.append(item)

    filename = "../InvoiceItems.xlsx"
    wb.save(filename)
    print(f"Saved {len(invoice_items)} InvoiceItems into {filename}")

if __name__ == "__main__":
    num_items = 50000  
    num_invoices = 5000
    invoice_items = generate_invoice_items(num_items, num_invoices)  
    save_to_excel(invoice_items)