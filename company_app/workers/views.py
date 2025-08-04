from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from user.models import UserProfile
from .forms import WorkerForm
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from company.models import Company
from work_type.models import WorkType
from django.core.paginator import Paginator

@login_required
def workers(request):
    companies = Company.objects.all()
    services = WorkType.objects.all()
    company_services = {
        company.id: list(company.work_types.values_list('id', flat=True))
        for company in companies
    }
    workers_list = UserProfile.objects.filter(role=3).select_related('user', 'company').prefetch_related('work_types')
    paginator = Paginator(workers_list, 4)  # Cambia 8 por el número de trabajadores por página que desees
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'workers.html', {
        'companies': companies,
        'services': services,
        'company_services': company_services,
        'workers': page_obj.object_list,
        'page_obj': page_obj,
    })

@login_required
@csrf_exempt
def add_worker(request):
    if request.method == "POST":
        form = WorkerForm(request.POST, request.FILES)
        if form.is_valid():
            username = form.cleaned_data['username']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            if User.objects.filter(username=username).exists():
                return JsonResponse({'success': False, 'error': 'El nombre de usuario ya está registrado.'})
            if User.objects.filter(email=email).exists():
                return JsonResponse({'success': False, 'error': 'El email ya está registrado.'})

            user = User(
                username=username,
                first_name=form.cleaned_data['first_name'],
                last_name=form.cleaned_data['last_name'],
                email=email,
            )
            user.set_password(password)
            user.save()
            profile = UserProfile.objects.create(
                user=user,
                role=3,
                phone=form.cleaned_data['phone'],
                company=form.cleaned_data['company'],
            )
            profile.work_types.set(form.cleaned_data['services'])
            # Guardar la foto si se subió
            if request.FILES.get('photo'):
                profile.photo = request.FILES['photo']
                profile.save()
            else:
                profile.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'errors': form.errors})
    return JsonResponse({'success': False, 'error': 'Método no permitido'})