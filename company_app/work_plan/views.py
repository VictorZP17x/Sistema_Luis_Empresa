from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import WorkPlan, Task, TaskRequirement
from .forms import WorkPlanForm, TaskForm
from works_to_do.models import WorksToDo
from django.views.decorators.csrf import csrf_exempt

@login_required
def work_plan(request):
    work_plans = WorkPlan.objects.select_related('fk_works_to_do').all()
    works_to_do = WorksToDo.objects.all()
    form = WorkPlanForm()
    return render(request, 'work_plan.html', {
        'work_plans': work_plans,
        'works_to_do': works_to_do,
        'form': form,
    })

@csrf_exempt
@login_required
def work_plan_create(request):
    if request.method == 'POST':
        form = WorkPlanForm(request.POST)
        plan_name = request.POST.get('plan_name', '').strip()
        fk_works_to_do = request.POST.get('fk_works_to_do')
        if WorkPlan.objects.filter(fk_works_to_do_id=fk_works_to_do, status=False).exists():
            return JsonResponse({'status': 'error', 'message': 'Ya existe un plan de trabajo abierto para esta solicitud.'})
        if WorkPlan.objects.filter(plan_name__iexact=plan_name).exists():
            return JsonResponse({'status': 'error', 'message': 'Ya existe un plan de trabajo con ese nombre.'})
        if form.is_valid():
            plan = form.save()
            # Cambia el estado de la solicitud a Programado
            works_to_do = plan.fk_works_to_do
            if works_to_do.status == 0:
                works_to_do.status = 1
                works_to_do.save()
            return JsonResponse({'status': 'success', 'message': 'Plan de trabajo creado correctamente.'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Datos inválidos.'})
    return JsonResponse({'status': 'error', 'message': 'Método no permitido.'})

@login_required
def work_plan_update(request, pk):
    plan = get_object_or_404(WorkPlan, pk=pk)
    if plan.status:
        return JsonResponse({'status': 'error', 'message': 'El plan está cerrado y no puede editarse.'})
    if request.method == 'POST':
        form = WorkPlanForm(request.POST, instance=plan)
        plan_name = request.POST.get('plan_name', '').strip()
        if WorkPlan.objects.filter(plan_name__iexact=plan_name).exclude(pk=pk).exists():
            return JsonResponse({'status': 'error', 'message': 'Ya existe un plan de trabajo con ese nombre.'})
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success', 'message': 'Plan de trabajo actualizado.'})
        return JsonResponse({'status': 'error', 'message': 'Datos inválidos.'})
    return JsonResponse({'status': 'error', 'message': 'Método no permitido.'})

@login_required
def work_plan_delete(request, pk):
    plan = get_object_or_404(WorkPlan, pk=pk)
    works_to_do = plan.fk_works_to_do
    if plan.status:
        return JsonResponse({'status': 'error', 'message': 'El plan está cerrado y no puede eliminarse.'})
    if plan.task_set.filter(finished=False).exists():
        return JsonResponse({'status': 'error', 'message': 'No puede eliminar el plan mientras existan tareas sin terminar. Elimine o termine todas las tareas abiertas primero.'})
    if request.method == 'POST':
        plan.delete()
        # Si la solicitud ya no tiene ningún plan, vuelve a estado Pendiente
        if not WorkPlan.objects.filter(fk_works_to_do=works_to_do).exists():
            works_to_do.status = 0
            works_to_do.save()
        return JsonResponse({'status': 'success', 'message': 'Plan de trabajo eliminado.'})
    return JsonResponse({'status': 'error', 'message': 'Método no permitido.'})

@csrf_exempt
@login_required
def task_create(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        task_name = request.POST.get('task', '').strip()
        fk_work_plan = request.POST.get('fk_work_plan')
        # Verifica si ya existe una tarea con ese nombre en el mismo plan (ignorando mayúsculas/minúsculas)
        if Task.objects.filter(task__iexact=task_name, fk_work_plan_id=fk_work_plan).exists():
            return JsonResponse({'status': 'error', 'message': 'Ya existe una tarea con ese nombre en este plan.'})
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success', 'message': 'Tarea creada correctamente.'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Datos inválidos.', 'errors': form.errors})
    return JsonResponse({'status': 'error', 'message': 'Método no permitido.'})

@login_required
def tasks_by_work_plan(request, plan_id):
    tasks = Task.objects.filter(fk_work_plan_id=plan_id)
    data = []
    all_finished = True
    for task in tasks:
        if not task.finished:
            all_finished = False
        reqs = [req.requirement for req in task.requirements.all()]
        data.append({
            'id': task.id,
            'task': task.task,
            'requirements': reqs,
            'start_date': task.start_date.strftime("%Y-%m-%d %H:%M") if task.start_date else "",
            'end_date': task.end_date.strftime("%Y-%m-%d %H:%M") if task.end_date else "",
            'finished': task.finished,
        })
    plan = get_object_or_404(WorkPlan, pk=plan_id)
    return JsonResponse({'tasks': data, 'plan_status': plan.status, 'all_finished': all_finished})

@csrf_exempt
@login_required
def task_update(request, pk):
    task = get_object_or_404(Task, pk=pk)
    if request.method == 'POST':
        form = TaskForm(request.POST, instance=task)
        task_name = request.POST.get('task', '').strip()
        fk_work_plan = request.POST.get('fk_work_plan')
        # Excluye la tarea actual
        if Task.objects.filter(task__iexact=task_name, fk_work_plan_id=fk_work_plan).exclude(pk=pk).exists():
            return JsonResponse({'status': 'error', 'message': 'Ya existe una tarea con ese nombre en este plan.'})
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success', 'message': 'Tarea actualizada correctamente.'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Datos inválidos.', 'errors': form.errors})
    return JsonResponse({'status': 'error', 'message': 'Método no permitido.'})

@csrf_exempt
@login_required
def task_delete(request, pk):
    task = get_object_or_404(Task, pk=pk)
    plan = task.fk_work_plan
    if request.method == 'POST':
        task.delete()
        if not plan.task_set.filter(finished=False).exists() and plan.task_set.exists():
            plan.status = True
            plan.save()
        return JsonResponse({'status': 'success', 'message': 'Tarea eliminada.'})
    return JsonResponse({'status': 'error', 'message': 'Método no permitido.'})

@csrf_exempt
@login_required
def task_finish(request, pk):
    task = get_object_or_404(Task, pk=pk)
    if request.method == 'POST':
        observation = request.POST.get('observation', '').strip()
        task.finished = True
        task.observation = observation
        task.save()
        plan = task.fk_work_plan
        # Si el plan está abierto y la solicitud está Programada, pásala a En Proceso
        works_to_do = plan.fk_works_to_do
        if works_to_do.status == 1:
            works_to_do.status = 2
            works_to_do.save()
        # Si todas las tareas están terminadas, marca el plan y la solicitud como Terminado
        if not plan.status:
            if not plan.task_set.filter(finished=False).exists():
                plan.status = True
                plan.save()
                works_to_do.status = 3
                works_to_do.save()
        return JsonResponse({'status': 'success', 'message': 'Tarea marcada como terminada.'})
    return JsonResponse({'status': 'error', 'message': 'Método no permitido.'})

@csrf_exempt
@login_required
def get_observation(request, pk):
    task = get_object_or_404(Task, pk=pk)
    return JsonResponse({'observation': task.observation or ""})

@login_required
def progress_by_works_to_do(request, works_to_do_id):
    # Intenta buscar primero un plan activo
    plan = WorkPlan.objects.filter(fk_works_to_do_id=works_to_do_id).order_by('-id').first()
    if not plan:
        return JsonResponse({'success': False, 'msg': 'No hay plan de trabajo registrado.'})
    total = plan.task_set.count()
    finished = plan.task_set.filter(finished=True).count()
    return JsonResponse({'success': True, 'finished_tasks': finished, 'total_tasks': total})