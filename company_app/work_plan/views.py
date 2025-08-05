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
        if form.is_valid():
            form.save()
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
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success', 'message': 'Plan de trabajo actualizado.'})
        return JsonResponse({'status': 'error', 'message': 'Datos inválidos.'})
    return JsonResponse({'status': 'error', 'message': 'Método no permitido.'})

@login_required
def work_plan_delete(request, pk):
    plan = get_object_or_404(WorkPlan, pk=pk)
    if plan.status:
        return JsonResponse({'status': 'error', 'message': 'El plan está cerrado y no puede eliminarse.'})
    if request.method == 'POST':
        plan.delete()
        return JsonResponse({'status': 'success', 'message': 'Plan de trabajo eliminado.'})
    return JsonResponse({'status': 'error', 'message': 'Método no permitido.'})

@csrf_exempt
@login_required
def task_create(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
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
    for task in tasks:
        reqs = [req.requirement for req in task.requirements.all()]
        data.append({
            'id': task.id,
            'task': task.task,
            'requirements': reqs,
            'start_date': task.start_date.strftime("%Y-%m-%d %H:%M") if task.start_date else "",
            'end_date': task.end_date.strftime("%Y-%m-%d %H:%M") if task.end_date else "",
            'finished': task.finished,
        })
    return JsonResponse({'tasks': data, 'plan_status': Task.objects.get(pk=plan_id).fk_work_plan.status})

@csrf_exempt
@login_required
def task_update(request, pk):
    task = get_object_or_404(Task, pk=pk)
    if request.method == 'POST':
        form = TaskForm(request.POST, instance=task)
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
    if request.method == 'POST':
        task.delete()
        return JsonResponse({'status': 'success', 'message': 'Tarea eliminada.'})
    return JsonResponse({'status': 'error', 'message': 'Método no permitido.'})