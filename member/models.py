from django.db import models

# Create your models here.
class Member(models.Model):
    name = models.CharField(max_length=255)
    group = models.CharField(max_length=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "member"
        verbose_name_plural = "members"

    def __str__(self):
        return self.name

