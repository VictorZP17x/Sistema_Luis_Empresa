from django import forms
from django.contrib.auth.models import User
from user.models import UserProfile

class PersonalDataForm(forms.ModelForm):
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Contraseña'}),
        required=False,
        label="Contraseña"
    )
    phone = forms.CharField(
        required=False,
        label="Teléfono",
        widget=forms.TextInput(attrs={'id': 'id_phone'})
    )
    photo = forms.ImageField(
        required=False,
        label="Foto de perfil",
        widget=forms.FileInput(attrs={'id': 'id_photo', 'accept': 'image/*'})
    )
    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email']
        
        
    def __init__(self, *args, **kwargs):
        user = kwargs.get('instance')
        super().__init__(*args, **kwargs)
        if user and hasattr(user, 'userprofile'):
            self.fields['phone'].initial = user.userprofile.phone
            self.fields['photo'].initial = user.userprofile.photo
    def save(self, commit=True):
        user = super().save(commit=False)
        password = self.cleaned_data.get('password')
        if password:
            user.set_password(password)
        if commit:
            user.save()
            phone = self.cleaned_data.get('phone')
            photo = self.cleaned_data.get('photo')
            if hasattr(user, 'userprofile'):
                user.userprofile.phone = phone
                if photo:
                    user.userprofile.photo = photo
                user.userprofile.save()
        return user