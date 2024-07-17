import random
from openpyxl import Workbook

def generate_invoice_items(num_invoices):
    invoices = []
    for i in range(1, num_invoices + 1):
        client_id = random.randint(1, 20)
        discount = round(random.random()/2, 2)
        invoices.append((client_id, discount))
    return invoices

def save_to_excel(invoices):
    wb = Workbook()
    ws = wb.active
    ws.append(["CLintId", "Discount"]) 

    for item in invoices:
        ws.append(item)

    filename = "../Invoices.xlsx"
    wb.save(filename)
    print(f"Saved {len(invoices)} Invoices into {filename}")

if __name__ == "__main__":
    num_invoices = 5000  
    invoices = generate_invoice_items(num_invoices)  
    save_to_excel(invoices)
