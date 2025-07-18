from django.db import models
from django.contrib.auth.models import User

class Log_History(models.Model):
    action = models.CharField(max_length=50, null=False, verbose_name='Acción')
    description = models.CharField(max_length=255, null=False, verbose_name='Descripción')
    creation_date = models.DateTimeField(null=False, verbose_name='Fecha en la que se registra la acción')
    fk_user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Usuario')

    class Meta:
        db_table = 'log_history'

    def __str__(self):
        return self.action