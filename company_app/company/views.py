from django.shortcuts import render, redirect
from .models import Company
from .forms import CompanyForm
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from django.urls import reverse
import os
from django.conf import settings

from work_type.models import WorkType
# ...existing code...

def company(request):
    if request.method == 'POST':
        form = CompanyForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect(reverse('company:company') + '?success=1')
    else:
        form = CompanyForm()
    companies = Company.objects.all()
    work_types = WorkType.objects.all()
    return render(request, 'company.html', {
        'company': companies,
        'form': form,
        'work_types': work_types,
    })
    
def delete_company(request, pk):
    if request.method == "POST":
        try:
            company = Company.objects.get(pk=pk)
            if company.photo and company.photo.name:
                photo_path = company.photo.path
                if os.path.isfile(photo_path):
                    os.remove(photo_path)
            company.delete()
            return JsonResponse({'success': True})
        except Company.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Empresa no encontrada'})
    return JsonResponse({'success': False, 'error': 'Método no permitido'})



@csrf_exempt
def edit_company(request, pk):
    if request.method == "POST":
        try:
            company = Company.objects.get(pk=pk)
            company.name = request.POST.get("name")
            company.address = request.POST.get("address")
            company.phone_number = request.POST.get("phone_number")
            company.rif = request.POST.get("rif")
            company.description = request.POST.get("description")
            # Guardar nueva foto si se sube
            if 'photo' in request.FILES and request.FILES['photo']:
                company.photo = request.FILES['photo']
            company.save()
            work_types_ids = request.POST.getlist('work_types')
            company.work_types.set(work_types_ids)
            return JsonResponse({'success': True})
        except Company.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Empresa no encontrada'})
    return JsonResponse({'success': False, 'error': 'Método no permitido'})


def generate_pdf(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="empresas.pdf"'

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
    title = Paragraph("Reporte de Empresas", styles['Title'])
    elements.append(title)
    elements.append(Spacer(1, 12))

    # Encabezados de la tabla
    data = [
        [
            Paragraph("<b>#</b>", styleN),
            Paragraph("<b>Nombre</b>", styleN),
            Paragraph("<b>Dirección</b>", styleN),
            Paragraph("<b>Teléfono</b>", styleN),
            Paragraph("<b>RIF</b>", styleN),
            Paragraph("<b>Descripción</b>", styleN)
        ]
    ]

    # Datos de la tabla
    companies = Company.objects.all()
    for idx, company in enumerate(companies, 1):
        data.append([
            Paragraph(str(idx), styleN),
            Paragraph(company.name or "", styleN),
            Paragraph(company.address or "", styleN),
            Paragraph(company.phone_number or "", styleN),
            Paragraph(company.rif or "", styleN),
            Paragraph(company.description or "", styleN)
        ])

    # Calcular el ancho total disponible
    page_width = letter[0] - doc.leftMargin - doc.rightMargin
    # Proporciones para cada columna (ajusta si lo deseas)
    proportions = [0.06, 0.18, 0.24, 0.13, 0.13, 0.26]
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