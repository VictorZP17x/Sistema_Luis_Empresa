from django import forms
from django.contrib.auth.models import User
from user.models import UserProfile

class PersonalDataForm(forms.ModelForm):
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'contraseña oculta'}),
        required=False,
        label="Contraseña"
    )
    phone = forms.CharField(
        required=False,
        label="Teléfono",
        widget=forms.TextInput(attrs={'id': 'id_phone'})
    )
    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email']

    def __init__(self, *args, **kwargs):
        user = kwargs.get('instance')
        super().__init__(*args, **kwargs)
        if user and hasattr(user, 'userprofile'):
            self.fields['phone'].initial = user.userprofile.phone

    def save(self, commit=True):
        user = super().save(commit=False)
        password = self.cleaned_data.get('password')
        if password:
            user.set_password(password)
        if commit:
            user.save()
            phone = self.cleaned_data.get('phone')
            if hasattr(user, 'userprofile'):
                user.userprofile.phone = phone
                user.userprofile.save()
        return user