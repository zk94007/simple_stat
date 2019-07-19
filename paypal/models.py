from django.db import models

# Create your models here.
class Paypal(models.Model):
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "paypal"
        verbose_name_plural = "paypals"
        ordering = ('email', )

    def __str__(self):
        return self.email
        