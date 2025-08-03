from django import forms
from django.contrib.auth.models import User
from company.models import Company
from work_type.models import WorkType

class WorkerForm(forms.Form):
    username = forms.CharField(max_length=150)
    password = forms.CharField(widget=forms.PasswordInput)
    first_name = forms.CharField(max_length=30)
    last_name = forms.CharField(max_length=30)
    email = forms.EmailField()
    phone = forms.CharField(max_length=20)
    company = forms.ModelChoiceField(queryset=Company.objects.all())
    services = forms.ModelMultipleChoiceField(queryset=WorkType.objects.all())
    photo = forms.ImageField(required=False)