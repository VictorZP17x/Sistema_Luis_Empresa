from django.db import models

class WorkPlan(models.Model):
    plan_name = models.CharField(max_length=50, null=False, verbose_name='Nombre del plan de trabajo')
    status = models.BooleanField(default=False)
    fk_works_to_do = models.ForeignKey('works_to_do.WorksToDo', on_delete=models.CASCADE, verbose_name='Solicitud de trabajo')

    class Meta:
        db_table = 'work_plan'

    def __str__(self):
        return self.plan_name

class Task(models.Model):
    task = models.CharField(max_length=50, null=False, verbose_name='Nombre de la tarea')
    start_date = models.DateTimeField(null=False, verbose_name='Fecha de inicio')
    end_date = models.DateTimeField(null=False, verbose_name='Fecha de finalización')
    finished = models.BooleanField(default=False, verbose_name='Terminada')
    observation = models.TextField(null=True, blank=True, verbose_name='Observación')
    fk_work_plan = models.ForeignKey(WorkPlan, on_delete=models.CASCADE, verbose_name='Plan de Trabajo')

    class Meta:
        db_table = 'tasks'

    def __str__(self):
        return self.task

class TaskRequirement(models.Model):
    fk_task = models.ForeignKey(Task, on_delete=models.CASCADE, verbose_name='Tarea', related_name='requirements')
    requirement = models.CharField(max_length=255, verbose_name='Requerimiento')

    class Meta:
        db_table = 'task_requirements'

    def __str__(self):
        return self.requirement