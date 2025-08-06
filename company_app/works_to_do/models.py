from django.db import models
from django.contrib.auth.models import User
from company.models import Company
from work_type.models import WorkType

STATUS_CHOICES = [
        (0, 'Pendiente'),
        (1, 'Programado'),
        (2, 'En Proceso'),
        (3, 'Terminado'),
    ]

class WorksToDo(models.Model):
    name = models.CharField(max_length=50, null=False, verbose_name='Nombre')
    description = models.CharField(max_length=255, null=False, verbose_name='Descripción')
    status = models.IntegerField(choices=STATUS_CHOICES, default=0, verbose_name='Estado del Trabajo')
    fk_user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Usuario')
    fk_company = models.ForeignKey(Company, on_delete=models.CASCADE, verbose_name='Empresa')
    fk_work_type = models.ManyToManyField(WorkType, verbose_name='Servicio')
    fk_worker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trabajos_asignados', verbose_name='Trabajador')
    
    class Meta:
        db_table = 'works_to_do'

    def __str__(self):
        return self.name