from django import forms
from .models import WorkPlan, Task, TaskRequirement

class WorkPlanForm(forms.ModelForm):
    class Meta:
        model = WorkPlan
        fields = ['plan_name', 'fk_works_to_do']

class TaskForm(forms.ModelForm):
    requirements = forms.CharField(
        widget=forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
        help_text="Ingrese los requerimientos, uno por línea."
    )

    class Meta:
        model = Task
        fields = ['task', 'start_date', 'end_date', 'fk_work_plan']

    def save(self, commit=True):
        instance = super().save(commit)
        requirements_text = self.cleaned_data.get('requirements', '')
        requirements_list = [req.strip() for req in requirements_text.splitlines() if req.strip()]
        if commit:
            instance.requirements.all().delete()
            for req in requirements_list:
                TaskRequirement.objects.create(fk_task=instance, requirement=req)
        return instance