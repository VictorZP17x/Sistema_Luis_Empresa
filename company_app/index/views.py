from django.shortcuts import render
from company.models import Company
from django.core.paginator import Paginator

def index(request):
    empresas = Company.objects.all().order_by('name')
    paginator = Paginator(empresas, 3)  # 3 por página
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'index.html', {'page_obj': page_obj})