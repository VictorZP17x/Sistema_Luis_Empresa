from django.shortcuts import render
# from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import WorksToDo, Company, User, WorkType

# @login_required
def works_to_do(request):
    works_to_do = WorksToDo.objects.all()
    companies = Company.objects.all()
    users = User.objects.all()
    work_types = WorkType.objects.all()
    return render(request, 'works_to_do.html', {
        'works_to_do': works_to_do,
        'companies': companies,
        'users': users,
        'work_types': work_types
    })

@csrf_exempt
def add_works_to_do(request):
    if request.method == 'POST':
        data = request.POST
        work = WorksToDo.objects.create(
            name=data['name'],
            fk_company_id=data['fk_company'],
            fk_user_id=data['fk_user'],
            fk_work_type_id=data['fk_work_type'],
            description=data['description']
        )
        return JsonResponse({'success': True, 'id': work.id})

@csrf_exempt
def edit_works_to_do(request):
    if request.method == 'POST':
        data = request.POST
        work = WorksToDo.objects.get(id=data['id'])
        work.name = data['name']
        work.fk_company_id = data['fk_company']
        work.fk_user_id = data['fk_user']
        work.fk_work_type_id = data['fk_work_type']
        work.description = data['description']
        work.save()
        return JsonResponse({'success': True})

@csrf_exempt
def delete_works_to_do(request):
    if request.method == 'POST':
        work = WorksToDo.objects.get(id=request.POST['id'])
        work.delete()
        return JsonResponse({'success': True})