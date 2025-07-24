from django import forms
from django.contrib.auth.models import User

class RegisterForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    telefono = forms.CharField(max_length=20)

    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email']