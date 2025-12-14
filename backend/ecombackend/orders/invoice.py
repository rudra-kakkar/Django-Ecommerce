from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
import os
from django.conf import settings


def generate_invoice_pdf(order):
    invoice_dir = os.path.join(settings.MEDIA_ROOT, "invoices")
    os.makedirs(invoice_dir, exist_ok=True)

    file_path = os.path.join(invoice_dir, f"invoice_{order.id}.pdf")
    print("INVOICE PATH:", file_path)   # 👈 ADD THIS


    c = canvas.Canvas(file_path, pagesize=A4)
    width, height = A4

    # Header
    c.setFont("Helvetica-Bold", 18)
    c.drawString(30 * mm, height - 30 * mm, "INVOICE")

    # Order info
    c.setFont("Helvetica", 10)
    c.drawString(30 * mm, height - 45 * mm, f"Order ID: {order.id}")
    c.drawString(30 * mm, height - 52 * mm, f"Date: {order.created_at.strftime('%d %b %Y')}")
    c.drawString(30 * mm, height - 59 * mm, f"Payment Method: {order.payment_method}")
    c.drawString(30 * mm, height - 66 * mm, f"Payment Status: {order.payment_status}")

    # Customer
    c.drawString(30 * mm, height - 80 * mm, "Bill To:")
    c.drawString(30 * mm, height - 87 * mm, order.user.username)
    c.drawString(30 * mm, height - 94 * mm, order.shipping_address)

    # Table header
    y = height - 115 * mm
    c.setFont("Helvetica-Bold", 10)
    c.drawString(30 * mm, y, "Product")
    c.drawString(110 * mm, y, "Qty")
    c.drawString(130 * mm, y, "Price")

    c.setFont("Helvetica", 10)
    y -= 10

    for item in order.items.all():
        c.drawString(30 * mm, y, item.product.title)
        c.drawString(110 * mm, y, str(item.quantity))
        c.drawString(130 * mm, y, f"₹{item.price * item.quantity}")
        y -= 10

    # Total
    c.setFont("Helvetica-Bold", 12)
    c.drawString(30 * mm, y - 10, f"Total Amount: ₹{order.total_price}")

    c.showPage()
    c.save()

    return file_path
