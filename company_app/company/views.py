from django.shortcuts import render
# from django.contrib.auth.decorators import login_required
from . models import Company

# @login_required
def company(request):
    company = Company.objects.all()
    return render(request, 'company.html', {
        'company': company,
    })