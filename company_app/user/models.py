from django.db import models
from django.contrib.auth.models import User
from company.models import Company
from work_type.models import WorkType

class UserProfile(models.Model):
    ROLE_CHOICES = [
        (0, 'Administrador'),
        (1, 'Empleado'),
        (2, 'Cliente'),
        (3, 'Trabajador'), #Se filtran por la empresa específica donde trabajan
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.IntegerField(choices=ROLE_CHOICES, default=0, null=False)
    phone = models.CharField(max_length=20, blank=True, null=True)
    company = models.ForeignKey(Company, null=True, blank=True, on_delete=models.SET_NULL)
    work_types = models.ManyToManyField(WorkType, blank=True, related_name='workers')
    photo = models.ImageField(upload_to='workers/photos/', null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"