from celery import shared_task
from django.core.mail import EmailMessage
from django.conf import settings
from .invoice import generate_invoice_pdf
from .models import Order


@shared_task
def send_order_confirmation_email(email, order_id, total):
    order = Order.objects.get(id=order_id)
    pdf_path = generate_invoice_pdf(order)

    subject = f"Invoice for Order #{order.id}"
    body = (
        f"Thank you for your order!\n\n"
        f"Order ID: {order.id}\n"
        f"Total: ₹{total}\n\n"
        "Please find your invoice attached."
    )

    mail = EmailMessage(
        subject,
        body,
        settings.DEFAULT_FROM_EMAIL,
        [email],
    )

    mail.attach_file(pdf_path)
    mail.send()

    return "Invoice email sent"
