from django.shortcuts import render
from company.models import Company
from works_to_do.models import WorksToDo
from user.models import UserProfile
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required

@login_required
def home(request):
    is_cliente = hasattr(request.user, 'userprofile') and request.user.userprofile.role == 2
    return render(request, 'home.html', {
        'is_cliente': is_cliente,
    })

@login_required
def dashboard(request):
    companies = Company.objects.all().order_by('name')
    paginator = Paginator(companies, 4)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    employees_count = UserProfile.objects.filter(role=1).count()
    admins_count = UserProfile.objects.filter(role=0).count()
    clients_count = UserProfile.objects.filter(role=2).count()
    companies_count = companies.count()
    is_cliente = hasattr(request.user, 'userprofile') and request.user.userprofile.role == 2

    # Filtrar trabajos según el tipo de usuario
    if is_cliente:
        works_count = WorksToDo.objects.filter(fk_user=request.user).count()
        works = WorksToDo.objects.filter(fk_user=request.user)
    else:
        works_count = WorksToDo.objects.count()
        works = WorksToDo.objects.all()
        
    # Elimina el flag después de mostrarlo
    show_welcome = request.session.pop('show_welcome', False)

    # Diccionarios para servicios y trabajadores
    workers_detail = {}
    workers_by_service = {}

    for company in companies:
        workers_detail[company.id] = {}
        workers_by_service[company.id] = {}
        for wt in company.work_types.all():
            # Filtra SOLO trabajadores de la empresa y ese servicio
            workers = UserProfile.objects.filter(
                role=3,
                company=company,
                work_types__id=wt.id
            ).distinct()
            workers_detail[company.id][wt.id] = [
                {
                    'id': w.user.id,
                    'name': f"{w.user.first_name} {w.user.last_name}",
                    'email': w.user.email,
                    'phone': w.phone,
                    'photo': w.photo.url if w.photo else None
                }
                for w in workers
            ]
            workers_by_service[company.id][wt.id] = workers.count()
            
    return render(request, 'dashboard.html', {
        'page_obj': page_obj,
        'companies': companies,
        'companies_count': companies_count,
        'employees_count': employees_count,
        'admins_count': admins_count,
        'clients_count': clients_count,
        'works_count': works_count,
        'works': works,
        'show_header_search': True,
        'is_cliente': is_cliente,
        'show_welcome': show_welcome,
        'workers_by_service': workers_by_service,
        'workers_detail': workers_detail,
    })