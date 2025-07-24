from django.shortcuts import render
from company.models import Company
from django.core.paginator import Paginator

def index(request):
    companies = Company.objects.all()
    paginator = Paginator(companies, 6)  # 6 empresas por página
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return render(request, 'partials/servicios_section.html', {'page_obj': page_obj})
    return render(request, 'index.html', {'page_obj': page_obj})