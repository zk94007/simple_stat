from django.contrib import admin
from transaction.models import Transaction

class TransactionAdmin(admin.ModelAdmin):
    list_display = ('paypal', 'member', 'amount', 'description', 'date')

# Register your models here.
admin.site.register(Transaction, TransactionAdmin)
