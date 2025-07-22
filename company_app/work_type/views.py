from django.shortcuts import render, redirect
from .models import WorkType
from .forms import WorkTypeForm
from django.urls import reverse
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet

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

@csrf_exempt
def edit_service(request):
    if request.method == "POST":
        service_id = request.POST.get("service_id")
        name = request.POST.get("name")
        description = request.POST.get("description")
        try:
            service = WorkType.objects.get(pk=service_id)
            service.name = name
            service.description = description
            service.save()
            return JsonResponse({'success': True})
        except WorkType.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Servicio no encontrado'})
    return JsonResponse({'success': False, 'error': 'Método no permitido'})

def generate_pdf(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="servicios.pdf"'

    doc = SimpleDocTemplate(
        response,
        pagesize=letter,
        rightMargin=20,
        leftMargin=20,
        topMargin=30,
        bottomMargin=20
    )
    elements = []
    styles = getSampleStyleSheet()
    styleN = styles['Normal']
    styleN.wordWrap = 'CJK'

    # Título
    title = Paragraph("Reporte de Servicios", styles['Title'])
    elements.append(title)
    elements.append(Spacer(1, 12))

    # Encabezados de la tabla
    data = [
        [
            Paragraph("<b>#</b>", styleN),
            Paragraph("<b>Nombre</b>", styleN),
            Paragraph("<b>Descripción</b>", styleN)
        ]
    ]

    # Datos de la tabla
    services = WorkType.objects.all()
    for idx, service in enumerate(services, 1):
        data.append([
            Paragraph(str(idx), styleN),
            Paragraph(service.name or "", styleN),
            Paragraph(service.description or "", styleN)
        ])

    # Calcular el ancho total disponible
    page_width = letter[0] - doc.leftMargin - doc.rightMargin
    # Proporciones para cada columna (ajusta si lo deseas)
    proportions = [0.08, 0.30, 0.62]
    col_widths = [page_width * p for p in proportions]

    # Crear la tabla centrada y ocupando el ancho disponible
    table = Table(data, repeatRows=1, colWidths=col_widths, hAlign='CENTER')

    # Estilos de la tabla
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#7798bd")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor("#e3f2fd")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#e3f2fd"), colors.white]),
        ('GRID', (0, 0), (-1, -1), 0.8, colors.HexColor("#1976d2")),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (0, 1), (-1, -1), 'LEFT'),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
    ]))

    elements.append(table)
    doc.build(elements)
    return response