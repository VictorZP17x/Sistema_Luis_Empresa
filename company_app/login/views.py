from django.shortcuts import render, redirect
# from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login as auth_login, logout
from django.views.decorators.cache import never_cache
from django.contrib.auth.models import User, Group
from .forms import RegisterForm
from django.urls import reverse
from user.models import UserProfile
import re
from django.http import JsonResponse
import json

# @login_required
def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        if len(password) < 8 or not re.search(r'[A-Za-z]', password) or not re.search(r'\d', password):
            error = "La contraseña debe tener al menos 8 caracteres, una letra y un número."
            return render(request, 'login.html', {'error': error})
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            # Flag de bienvenida
            request.session['show_welcome'] = True
            return redirect('home:dashboard')
        else:
            error = "Usuario o contraseña incorrectos."
            return render(request, 'login.html', {'error': error})
    return render(request, 'login.html', {
    })

# @login_required
def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            password = form.cleaned_data['password']
            if len(password) < 8 or not re.search(r'[A-Za-z]', password) or not re.search(r'\d', password):
                error_msg = "La contraseña debe tener al menos 8 caracteres, una letra y un número."
                return render(request, 'register.html', {'form': form, 'register_error': error_msg})
            username = form.cleaned_data['username']
            email = form.cleaned_data['email']
            telefono = form.cleaned_data['telefono']

            # Validar si ya existen usuario, email o teléfono
            user_exists = User.objects.filter(username=username).exists()
            email_exists = User.objects.filter(email=email).exists()
            telefono_exists = UserProfile.objects.filter(phone=telefono).exists()

            if user_exists or email_exists or telefono_exists:
                error_msg = "El "
                errores = []
                if user_exists:
                    errores.append("usuario")
                if email_exists:
                    errores.append("email")
                if telefono_exists:
                    errores.append("teléfono")
                error_msg += ", ".join(errores) + " ya existe. Por favor intente con otro."
                return render(request, 'register.html', {'form': form, 'register_error': error_msg})

            # Si no existen, registrar normalmente
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            # Asignar grupo cliente (id=2)
            try:
                cliente_group = Group.objects.get(id=2)
                user.groups.add(cliente_group)
            except Group.DoesNotExist:
                pass
            # Crear el perfil de usuario con rol=2 (cliente) y teléfono
            UserProfile.objects.create(
                user=user,
                role=2,  # Cliente
                phone=telefono
            )
            # Redirige al login con SweetAlert
            return redirect(reverse('login:login') + '?registered=1')
    else:
        form = RegisterForm()
    return render(request, 'register.html', {'form': form})
    
@never_cache
# @login_required
def log_out(request):
    logout(request)
    response = redirect('login:login')
    response['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    return response

def validar_datos(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        telefono = data.get('telefono')

        errores = []
        if User.objects.filter(username=username).exists():
            errores.append("usuario")
        if User.objects.filter(email=email).exists():
            errores.append("email")
        if UserProfile.objects.filter(phone=telefono).exists():
            errores.append("teléfono")
        if errores:
            error_msg = "El " + ", ".join(errores) + " ya existe. Por favor intente con otro."
            return JsonResponse({'error': error_msg})
        return JsonResponse({'ok': True})