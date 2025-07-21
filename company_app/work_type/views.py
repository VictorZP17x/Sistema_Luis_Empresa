from django.shortcuts import render, redirect
from .models import WorkType
from .forms import WorkTypeForm
from django.urls import reverse
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def work_type(request):
    services = WorkType.objects.all()
    form = WorkTypeForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            form.save()
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'success': True})
            return redirect(reverse('work_type:work_type') + '?success=1')
        else:
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'errors': form.errors})
    return render(request, 'work_type.html', {
        'services': services,
        'form': form,
    })
    
@csrf_exempt
def delete_service(request, pk):
    if request.method == "POST":
        try:
            service = WorkType.objects.get(pk=pk)
            service.delete()
            return JsonResponse({'success': True})
        except WorkType.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Servicio no encontrado'})
    return JsonResponse({'success': False, 'error': 'Método no permitido'})

def generate_pdf(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="servicios.pdf"'
    p = canvas.Canvas(response, pagesize=letter)
    p.setFont("Helvetica", 12)
    p.drawString(100, 750, "Reporte de Servicios")
    y = 720
    for service in WorkType.objects.all():
        p.drawString(100, y, f"{service.name}: {service.description}")
        y -= 20
    p.showPage()
    p.save()
    return response