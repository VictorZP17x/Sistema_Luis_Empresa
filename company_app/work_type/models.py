from django.db import models

class WorkType(models.Model):
    name = models.CharField(max_length=50, null=False, verbose_name='Nombre')
    description = models.CharField(max_length=255, null=False, verbose_name='Descripción')
    
    class Meta:
        db_table = 'work_type'

    def __str__(self):
        return self.name