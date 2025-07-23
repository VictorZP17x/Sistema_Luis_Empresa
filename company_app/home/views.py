from django.shortcuts import render
from company.models import Company
# from django.contrib.auth.decorators import login_required

# @login_required
def home(request):
    return render(request, 'home.html', {
    })

def dashboard(request):
    companies = Company.objects.all()
    companies_count = companies.count()
    return render(request, 'dashboard.html', {
        'companies': companies,
        'companies_count': companies_count,
        'show_header_search': True
    })