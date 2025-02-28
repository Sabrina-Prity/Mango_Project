from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

# Payment status choices
PAYMENT_STATUS = [
    ('Pending', 'Pending'), 
    ('Completed', 'Completed'), 
    ('Canceled', 'Canceled'),
]

# Validator function for positive amount
def positive_amount(value):
    if value <= 0:
        raise ValidationError("Amount must be greater than zero.")

class Payment_Model(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="payments")
    order = models.ForeignKey('add_to_cart.Order', on_delete=models.CASCADE, related_name='payments')  # Specify related_name

    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[positive_amount])
    transaction_id = models.CharField(max_length=100, unique=True)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='Pending')
    payment_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transaction {self.transaction_id}: {self.user.username} - {self.amount} ({self.payment_status})"
