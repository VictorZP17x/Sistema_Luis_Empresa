from django.shortcuts import render
from company.models import Company
from user.models import UserProfile
from django.core.paginator import Paginator

def index(request):
    empresas = Company.objects.all().order_by('name')
    paginator = Paginator(empresas, 3)  # 3 por página
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # Diccionario: {company_id: {work_type_id: cantidad_trabajadores}}
    workers_by_service = {}
    for company in empresas:
        workers_by_service[company.id] = {}
        for wt in company.work_types.all():
            count = UserProfile.objects.filter(
                role=3,  # Trabajador
                company=company,
                work_types__id=wt.id
            ).distinct().count()
            workers_by_service[company.id][wt.id] = count

    return render(request, 'index.html', {
        'page_obj': page_obj,
        'workers_by_service': workers_by_service,
    })