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
import json
from django.template.loader import render_to_string
from works_to_do.models import WorksToDo

@login_required
def workers(request):
    companies = Company.objects.all()
    services = WorkType.objects.all()
    company_services = {
        company.id: list(company.work_types.values_list('id', flat=True))
        for company in companies
    }
    workers_list = UserProfile.objects.filter(role=3).select_related('user', 'company').prefetch_related('work_types').order_by('id')
    paginator = Paginator(workers_list, 4)
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
def workers_list_fragment(request):
    page_number = request.GET.get('page', 1)
    workers_list = UserProfile.objects.filter(role=3).select_related('user', 'company').prefetch_related('work_types')
    paginator = Paginator(workers_list, 4)
    page_obj = paginator.get_page(page_number)
    html = render_to_string('partials/workers_cards.html', {
        'workers': page_obj.object_list,
        'page_obj': page_obj,
    }, request=request)
    return JsonResponse({'html': html})

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

@login_required
@csrf_exempt
def edit_worker(request):
    if request.method == "POST":
        user_id = request.POST.get('user_id')
        try:
            profile = UserProfile.objects.get(user_id=user_id)
            user = profile.user
            user.username = request.POST.get('username')
            user.first_name = request.POST.get('first_name')
            user.last_name = request.POST.get('last_name')
            user.email = request.POST.get('email')
            user.save()
            profile.phone = request.POST.get('phone')
            profile.company_id = request.POST.get('company')
            services = request.POST.getlist('services')
            profile.work_types.set(services)
            if request.FILES.get('photo'):
                profile.photo = request.FILES['photo']
            profile.save()
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Método no permitido'})

@login_required
@csrf_exempt
def delete_worker(request, user_id):
    if request.method == "POST":
        try:
            profile = UserProfile.objects.get(user_id=user_id)
            user = profile.user
            # Verificar si está asociado a alguna solicitud de trabajo
            if WorksToDo.objects.filter(fk_worker=profile.user).exists():
                return JsonResponse({'success': False, 'error': 'No se puede eliminar: el trabajador está asociado a una solicitud de trabajo.'})
            profile.delete()
            user.delete()
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Método no permitido'})

@login_required
@csrf_exempt
def validar_datos_trabajador(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        phone = data.get('phone')
        user_id = data.get('user_id')  # Para edición

        errores = []
        if User.objects.filter(username=username).exclude(pk=user_id).exists():
            errores.append("usuario")
        if User.objects.filter(email=email).exclude(pk=user_id).exists():
            errores.append("email")
        if UserProfile.objects.filter(phone=phone).exclude(user__pk=user_id).exists():
            errores.append("teléfono")
        if errores:
            error_msg = "El " + ", ".join(errores) + " ya existe. Por favor intente con otro."
            return JsonResponse({'error': error_msg})
        return JsonResponse({'ok': True})