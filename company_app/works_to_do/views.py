from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import WorksToDo, Company, User, WorkType
from django.utils.safestring import mark_safe
import json
import os
import datetime
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from django.conf import settings
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required

@login_required
def works_to_do(request):
    works_to_do = WorksToDo.objects.all()
    companies = Company.objects.all()
    users = User.objects.filter(userprofile__role=2)
    work_types = WorkType.objects.all()
    company_services = {
        company.id: list(company.work_types.values_list('id', flat=True))
        for company in companies
    }
    for w in works_to_do:
        w.fk_work_type_ids_json = mark_safe(json.dumps(list(w.fk_work_type.values_list('id', flat=True))))
    return render(request, 'works_to_do.html', {
        'works_to_do': works_to_do,
        'companies': companies,
        'users': users,
        'work_types': work_types,
        'company_services': company_services,
    })

@login_required
@csrf_exempt
def add_works_to_do(request):
    if request.method == 'POST':
        data = request.POST
        work = WorksToDo.objects.create(
            name=data['name'],
            fk_company_id=data['fk_company'],
            fk_user_id=data['fk_user'],
            description=data['description']
        )
        work.fk_work_type.set(request.POST.getlist('fk_work_type'))
        return JsonResponse({'success': True, 'id': work.id})

@login_required
@csrf_exempt
def edit_works_to_do(request):
    if request.method == 'POST':
        data = request.POST
        work = WorksToDo.objects.get(id=data['id'])
        work.name = data['name']
        work.fk_company_id = data['fk_company']
        work.fk_user_id = data['fk_user']
        work.description = data['description']
        work.save()
        work.fk_work_type.set(request.POST.getlist('fk_work_type'))
        return JsonResponse({'success': True})

@login_required
@csrf_exempt
def delete_works_to_do(request):
    if request.method == 'POST':
        work = WorksToDo.objects.get(id=request.POST['id'])
        work.delete()
        return JsonResponse({'success': True})

@login_required
@csrf_exempt
@require_POST
def change_status_works_to_do(request):
    work = WorksToDo.objects.get(id=request.POST['id'])
    if work.status < 2:
        work.status += 1
        work.save()
        return JsonResponse({'success': True, 'new_status': work.status})
    return JsonResponse({'success': False, 'msg': 'El trabajo ya está terminado.'})

@login_required
def footer(canvas, doc):
    fecha = datetime.datetime.now().strftime("%d/%m/%Y %H:%M")
    footer_text = f"Emitido: {fecha}    Página {canvas.getPageNumber()}"
    canvas.saveState()
    canvas.setFont('Helvetica', 8)
    width, height = letter
    canvas.drawRightString(width - 20, 15, footer_text)
    canvas.restoreState()

@login_required
def generate_pdf_all(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="Reporte_Trabajos.pdf"'

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

    # Logo
    logo_path = os.path.join(settings.BASE_DIR, 'static', 'assets', 'images', 'logo_pdf.png')
    if os.path.exists(logo_path):
        img = Image(logo_path, width=60, height=60)
    else:
        img = Spacer(1, 40)

    # Título
    title = Paragraph("Trabajos", styles['Title'])

    # Cabecera
    header_table = Table(
        [[img, title]],
        colWidths=[0, doc.width - 0],
        hAlign='LEFT'
    )
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (1, 0), (1, 0), 'CENTER'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    elements.append(header_table)
    elements.append(Spacer(1, 12))

    # Encabezados de la tabla
    data = [
        [
            Paragraph("<b>#</b>", styleN),
            Paragraph("<b>Nombre</b>", styleN),
            Paragraph("<b>Encargado</b>", styleN),
            Paragraph("<b>Cliente</b>", styleN),
            Paragraph("<b>Servicio(s)</b>", styleN),
            Paragraph("<b>Descripción</b>", styleN),
            Paragraph("<b>Estado</b>", styleN),
        ]
    ]

    # Datos de la tabla
    trabajos = WorksToDo.objects.all()
    ESTADOS = {0: "Programado", 1: "En Proceso", 2: "Terminado"}
    for idx, trabajo in enumerate(trabajos, 1):
        servicios = ", ".join([wt.name for wt in trabajo.fk_work_type.all()])
        estado = ESTADOS.get(trabajo.status, "Desconocido")
        data.append([
            Paragraph(str(idx), styleN),
            Paragraph(trabajo.name or "", styleN),
            Paragraph(str(trabajo.fk_company) if trabajo.fk_company else "", styleN),
            Paragraph(str(trabajo.fk_user) if trabajo.fk_user else "", styleN),
            Paragraph(servicios, styleN),
            Paragraph(trabajo.description or "", styleN),
            Paragraph(estado, styleN),
        ])

    # Anchos de columna
    page_width = letter[0] - doc.leftMargin - doc.rightMargin
    proportions = [0.05, 0.16, 0.16, 0.16, 0.16, 0.18, 0.12]
    col_widths = [page_width * p for p in proportions]

    # Tabla
    table = Table(data, repeatRows=1, colWidths=col_widths, hAlign='CENTER')
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#ffffff")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor("#ffffff")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#ffffff"), colors.white]),
        ('GRID', (0, 0), (-1, -1), 0.8, colors.HexColor("#000000")),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (0, 1), (-1, -1), 'LEFT'),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
    ]))

    elements.append(table)
    doc.build(elements, onFirstPage=footer, onLaterPages=footer)
    return response

@login_required
def generate_pdf_individual(request, pk):
    from .models import WorksToDo
    trabajo = WorksToDo.objects.get(pk=pk)

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="Solicitud_Trabajo_{trabajo.id}.pdf"'

    doc = SimpleDocTemplate(
        response,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=30
    )
    elements = []
    styles = getSampleStyleSheet()
    styleN = styles['Normal']
    styleB = styles['Heading4']

    # Logo y título
    logo_path = os.path.join(settings.BASE_DIR, 'static', 'assets', 'images', 'logo_pdf.png')
    if os.path.exists(logo_path):
        img = Image(logo_path, width=60, height=60)
    else:
        img = Spacer(1, 40)
    title = Paragraph(f"<b>Solicitud de Trabajo N° {trabajo.id}</b>", styles['Title'])
    header_table = Table(
        [[img, title]],
        colWidths=[0, doc.width - 0],
        hAlign='LEFT'
    )
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (1, 0), (1, 0), 'CENTER'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    elements.append(header_table)
    elements.append(Spacer(1, 18))

    # Datos de la empresa encargada
    empresa = trabajo.fk_company
    datos_empresa = [
        [Paragraph("<b>Empresa Encargada</b>", styleB)],
        [Paragraph(f"<b>Nombre:</b> {empresa.name if empresa else ''}", styleN)],
        [Paragraph(f"<b>Dirección:</b> {empresa.address if empresa else ''}", styleN)],
        [Paragraph(f"<b>Teléfono:</b> {empresa.phone_number if empresa else ''}", styleN)],
        [Paragraph(f"<b>RIF:</b> {empresa.rif if empresa else ''}", styleN)],
    ]
    empresa_table = Table(datos_empresa, colWidths=[doc.width])
    empresa_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.8, colors.black),
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f0f0f0")),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(empresa_table)
    elements.append(Spacer(1, 12))

    # Datos del cliente
    cliente = trabajo.fk_user
    telefono = ""
    if cliente:
        try:
            telefono = cliente.userprofile.phone or ""
        except Exception:
            telefono = ""
        datos_cliente = [
        [Paragraph("<b>Datos del Cliente</b>", styleB)],
        [Paragraph(f"<b>Nombre:</b> {cliente.get_full_name() if cliente else ''}", styleN)],
        [Paragraph(f"<b>Email:</b> {cliente.email if cliente else ''}", styleN)],
        [Paragraph(f"<b>Teléfono:</b> {telefono}", styleN)],
    ]
    cliente_table = Table(datos_cliente, colWidths=[doc.width])
    cliente_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.8, colors.black),
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f0f0f0")),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(cliente_table)
    elements.append(Spacer(1, 12))

    # Servicios solicitados
    servicios = ", ".join([wt.name for wt in trabajo.fk_work_type.all()])
    servicios_table = Table([
        [Paragraph("<b>Servicios Solicitados</b>", styleB)],
        [Paragraph(servicios, styleN)]
    ], colWidths=[doc.width])
    servicios_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.8, colors.black),
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f0f0f0")),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(servicios_table)
    elements.append(Spacer(1, 12))

    # Descripción del trabajo
    descripcion_table = Table([
        [Paragraph("<b>Descripción del Trabajo</b>", styleB)],
        [Paragraph(trabajo.description or "", styleN)]
    ], colWidths=[doc.width])
    descripcion_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.8, colors.black),
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f0f0f0")),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(descripcion_table)
    elements.append(Spacer(1, 18))
    
    ESTADOS = {0: "Programado", 1: "En Proceso", 2: "Terminado"}
    estado = ESTADOS.get(trabajo.status, "Desconocido")

    # Puedes agregarlo en la tabla de descripción del trabajo o como una tabla aparte:
    estado_table = Table([
        [Paragraph("<b>Estado del Trabajo</b>", styleB)],
        [Paragraph(estado, styleN)]
    ], colWidths=[doc.width])
    estado_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.8, colors.black),
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f0f0f0")),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(estado_table)
    elements.append(Spacer(1, 12))

    # Pie de página
    def footer(canvas, doc):
        fecha = datetime.datetime.now().strftime("%d/%m/%Y %H:%M")
        footer_text = f"Emitido: {fecha}    Página {canvas.getPageNumber()}"
        canvas.saveState()
        canvas.setFont('Helvetica', 8)
        width, height = letter
        canvas.drawRightString(width - 20, 15, footer_text)
        canvas.restoreState()

    doc.build(elements, onFirstPage=footer, onLaterPages=footer)
    return response