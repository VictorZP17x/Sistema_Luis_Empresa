from django import forms
from .models import WorkType

class WorkTypeForm(forms.ModelForm):
    description = forms.CharField(widget=forms.Textarea, label="Descripción")
    
    class Meta:
        model = WorkType
        fields = ['name', 'description']