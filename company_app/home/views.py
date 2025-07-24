from django.shortcuts import render
from company.models import Company
# from django.contrib.auth.decorators import login_required

# @login_required
def home(request):
    is_cliente = hasattr(request.user, 'userprofile') and request.user.userprofile.role == 2
    return render(request, 'home.html', {
        'is_cliente': is_cliente,
    })

def dashboard(request):
    companies = Company.objects.all()
    companies_count = companies.count()
    is_cliente = hasattr(request.user, 'userprofile') and request.user.userprofile.role == 2

    # Elimina el flag después de mostrarlo
    show_welcome = request.session.pop('show_welcome', False)

    return render(request, 'dashboard.html', {
        'companies': companies,
        'companies_count': companies_count,
        'show_header_search': True,
        'is_cliente': is_cliente,
        'show_welcome': show_welcome,
    })