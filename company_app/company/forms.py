from django import forms
from .models import Company

class CompanyForm(forms.ModelForm):
    class Meta:
        model = Company
        fields = ['name', 'address', 'phone_number', 'rif', 'description', 'photo', 'work_types']
        widgets = {
            'description': forms.Textarea(attrs={'id': 'add-description', 'rows': 3, 'maxlength': 255 }),
            'work_types': forms.SelectMultiple(attrs={'class': 'form-control'}),
        }