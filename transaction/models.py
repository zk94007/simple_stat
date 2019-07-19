from django.db import models

# Create your models here.
class Transaction(models.Model):
    paypal = models.ForeignKey('paypal.Paypal', on_delete = models.SET_NULL, related_name='transactions', null=True)
    member = models.ForeignKey('member.Member', on_delete = models.SET_NULL, related_name='transactions', null=True)
    amount = models.FloatField(default=0)
    description = models.TextField(default='')
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "transaction"
        verbose_name_plural = "transactions"

    def __str__(self):
        return self.description
