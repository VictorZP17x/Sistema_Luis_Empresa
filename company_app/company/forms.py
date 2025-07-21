from django import forms
from .models import Company

class CompanyForm(forms.ModelForm):
    class Meta:
        model = Company
        fields = ['name', 'address', 'phone_number', 'rif', 'description', 'photo']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 3}),
        }