from django.shortcuts import render, redirect
from .forms import PersonalDataForm

def personal_data(request):
    user = request.user
    if request.method == 'POST':
        form = PersonalDataForm(request.POST, instance=user)
        if form.is_valid():
            user = form.save(commit=False)
            password = form.cleaned_data.get('password')
            if password:
                user.set_password(password)
            user.save()
            return redirect('personal_data:personal_data')
    else:
        form = PersonalDataForm(instance=user)
    return render(request, 'personal_data.html', {'form': form})