from django.db import models

class Company(models.Model):
    name = models.CharField(max_length=50, null=False, verbose_name='Nombre')
    address = models.CharField(max_length=50, null=False, verbose_name='Dirección')
    phone_number = models.CharField(max_length=20, null=False, verbose_name='Teléfono')
    rif = models.CharField(max_length=20, null=False, verbose_name='RIF')
    description = models.CharField(max_length=255, null=False, verbose_name='Descripción')

    class Meta:
        db_table = 'company'

    def __str__(self):
        return self.name