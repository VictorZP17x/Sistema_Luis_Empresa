from django.shortcuts import render, redirect
from .forms import PersonalDataForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.contrib.auth.models import User
from user.models import UserProfile
from django.views.decorators.csrf import csrf_exempt
import json

@login_required
@csrf_exempt
def personal_data(request):
    user = request.user
    try:
        profile = UserProfile.objects.get(user=user)
    except UserProfile.DoesNotExist:
        profile = None

    if request.method == "POST" and request.headers.get("x-requested-with") == "XMLHttpRequest":
        username = request.POST.get("username")
        password = request.POST.get("password")
        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")
        email = request.POST.get("email")
        phone = request.POST.get("phone")

        # Validación de duplicados (excluyendo el propio usuario)
        errores = []
        if User.objects.filter(username=username).exclude(pk=user.id).exists():
            errores.append("usuario")
        if User.objects.filter(email=email).exclude(pk=user.id).exists():
            errores.append("email")
        if UserProfile.objects.filter(phone=phone).exclude(user__pk=user.id).exists():
            errores.append("teléfono")
        if errores:
            error_msg = "El " + ", ".join(errores) + " ya existe. Por favor intente con otro."
            return JsonResponse({'success': False, 'error': error_msg})

        try:
            user.username = username
            user.first_name = first_name
            user.last_name = last_name
            user.email = email
            # Solo actualiza la contraseña si el usuario la escribió
            if password and password.strip() != "":
                user.set_password(password)
            # Si no, la contraseña se mantiene igual
            user.save()
            if profile:
                profile.phone = phone
                profile.save()
            return JsonResponse({"success": True})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})

    else:
        form = PersonalDataForm(instance=user)
        return render(request, 'personal_data.html', {'form': form})