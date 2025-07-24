from django.shortcuts import render, redirect
# from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login as auth_login, logout
from django.views.decorators.cache import never_cache
from django.contrib.auth.models import User, Group
from .forms import RegisterForm
from django.urls import reverse
from user.models import UserProfile

# @login_required
def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            return redirect('home:dashboard')
        else:
            error = "Usuario o contraseña incorrectos"
            return render(request, 'login.html', {'error': error})
    return render(request, 'login.html', {
    })

# @login_required
def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            try:
                cliente_group = Group.objects.get(id=2)
                user.groups.add(cliente_group)
            except Group.DoesNotExist:
                pass
            # Redirige al login con un parámetro GET para mostrar el SweetAlert
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

def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
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
                phone=form.cleaned_data['telefono']
            )
            # Redirige al login con SweetAlert
            return redirect(reverse('login:login') + '?registered=1')
    else:
        form = RegisterForm()
    return render(request, 'register.html', {'form': form})