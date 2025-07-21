from django.shortcuts import render
from company.models import Company
# from django.contrib.auth.decorators import login_required

# @login_required
def home(request):
    return render(request, 'home.html', {
    })
    
# @login_required
def dashboard(request):
    return render(request, 'dashboard.html', {
    })
    
def dashboard(request):
    # ...tu lógica...
    return render(request, 'dashboard.html', {'show_header_search': True})

def dashboard(request):
    companies = Company.objects.all()
    return render(request, 'dashboard.html', {
        'companies': companies,
        'show_header_search': True
    })