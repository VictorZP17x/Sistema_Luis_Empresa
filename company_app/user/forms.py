from django import forms
from django.contrib.auth.models import User

class UserForm(forms.ModelForm):
    username = forms.CharField(label="Usuario")
    password = forms.CharField(label="Contraseña", widget=forms.PasswordInput)
    first_name = forms.CharField(label="Nombre")
    last_name = forms.CharField(label="Apellido")
    email = forms.EmailField(label="Email")
    phone = forms.CharField(label="Teléfono", required=False)

    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email']