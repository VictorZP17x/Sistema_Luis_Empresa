from django.shortcuts import render, redirect
from .forms import PersonalDataForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

@login_required
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
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'success': True})
            messages.success(request, "¡Tus datos personales se han actualizado correctamente!")
            return redirect('personal_data:personal_data')
        else:
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'error': 'Datos inválidos.'})
    else:
        form = PersonalDataForm(instance=user)
    return render(request, 'personal_data.html', {'form': form})