from django.shortcuts import render, redirect
# from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login as auth_login, logout
from django.views.decorators.cache import never_cache

# @login_required
def login(request):
    return render(request, 'login.html', {
    })

# @login_required
def register(request):
    return render(request, 'register.html', {
    })
    
@never_cache
# @login_required
def log_out(request):
    logout(request)
    response = redirect('login:login')
    response['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    return response