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
from work_plan.models import WorkPlan

@login_required
def works_to_do(request):
    is_trabajador = hasattr(request.user, 'userprofile') and request.user.userprofile.role == 3
    is_cliente = hasattr(request.user, 'userprofile') and request.user.userprofile.role == 2

    # Filtrar trabajos: si es trabajador, solo los suyos
    if is_trabajador:
        works_to_do = WorksToDo.objects.filter(fk_worker=request.user)
    elif is_cliente:
        works_to_do = WorksToDo.objects.filter(fk_user=request.user)
    else:
        works_to_do = WorksToDo.objects.all()

    companies = Company.objects.all()
    users = User.objects.filter(userprofile__role=2)
    work_types = WorkType.objects.all()
    from user.models import UserProfile
    workers = UserProfile.objects.filter(role=3).select_related('user', 'company').prefetch_related('work_types')
    workers_data = [
        {
            'id': w.user.id,
            'name': w.user.get_full_name() or w.user.username,
            'company_id': w.company.id if w.company else None,
            'work_types': [wt.id for wt in w.work_types.all()]
        }
        for w in workers
    ]
    company_services = {
        company.id: list(company.work_types.values_list('id', flat=True))
        for company in companies
    }
    for w in works_to_do:
        w.fk_work_type_ids_json = mark_safe(json.dumps(list(w.fk_work_type.values_list('id', flat=True))))
    
    show_welcome = request.session.pop('show_welcome', False)

    empresa_trabajador = None
    servicios_trabajador = []
    if is_trabajador:
        perfil = request.user.userprofile
        empresa_trabajador = perfil.company.id if perfil.company else None
        servicios_trabajador = list(perfil.work_types.values_list('id', flat=True))

    # Definir cliente_id SIEMPRE
    cliente_id = request.user.id if is_cliente else None

    return render(request, 'works_to_do.html', {
        'works_to_do': works_to_do,
        'companies': companies,
        'users': users,
        'work_types': work_types,
        'company_services': company_services,
        'workers': workers,
        'workers_data': workers_data,
        'is_trabajador': is_trabajador,
        'is_cliente': is_cliente,
        'show_welcome': show_welcome,
        'empresa_trabajador': empresa_trabajador,
        'servicios_trabajador': servicios_trabajador,
        'is_trabajador': is_trabajador,
        'is_cliente': is_cliente,
        'cliente_id': cliente_id,
    })

from notifications.models import Notification  # Importa el modelo

@login_required
@csrf_exempt
def add_works_to_do(request):
    if request.method == 'POST':
        data = request.POST
        work = WorksToDo.objects.create(
            name=data['name'],
            fk_company_id=data['fk_company'],
            fk_user_id=data['fk_user'],
            fk_worker_id=data['worker'],
            description=data['description'],
        )
        work.fk_work_type.set(request.POST.getlist('fk_work_type'))

        # Notificación para el cliente
        worker = work.fk_worker
        cliente = work.fk_user
        if worker and cliente:
            mensaje = f'Se ha realizado la solicitud al trabajador "{worker.get_full_name() or worker.username}", estas a la espera de que acepte tu peticion.'
            Notification.objects.create(
                user=cliente,
                message=mensaje
            )

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
        work.fk_worker_id = data['worker']
        work.description = data['description']
        work.save()
        work.fk_work_type.set(request.POST.getlist('fk_work_type'))
        return JsonResponse({'success': True})

@login_required
@csrf_exempt
def delete_works_to_do(request):
    if request.method == 'POST':
        work = WorksToDo.objects.get(id=request.POST['id'])
        # Validación: no permitir borrar si tiene un plan de trabajo asociado
        if WorkPlan.objects.filter(fk_works_to_do=work).exists():
            return JsonResponse({'success': False, 'error': 'No se puede eliminar la solicitud porque tiene un plan de trabajo registrado.'})
        work.delete()
        return JsonResponse({'success': True})

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

    # Encabezados de la tabla (ajustados)
    data = [
        [
            Paragraph("<b>#</b>", styleN),
            Paragraph("<b>Nombre</b>", styleN),
            Paragraph("<b>Empresa</b>", styleN),
            Paragraph("<b>Trabajador</b>", styleN),
            Paragraph("<b>Cliente</b>", styleN),
            Paragraph("<b>Servicio(s)</b>", styleN),
            Paragraph("<b>Descripción</b>", styleN),
            Paragraph("<b>Estado</b>", styleN),
        ]
    ]

    # Datos de la tabla (ajustados)
    trabajos = WorksToDo.objects.all()
    ESTADOS = {0: "Pendiente", 1: "Programado", 2: "En Proceso", 3: "Terminado"}
    for idx, trabajo in enumerate(trabajos, 1):
        servicios = ", ".join([wt.name for wt in trabajo.fk_work_type.all()])
        estado = ESTADOS.get(trabajo.status, "Desconocido")
        trabajador = trabajo.fk_worker
        cliente = trabajo.fk_user
        data.append([
            Paragraph(str(idx), styleN),
            Paragraph(trabajo.name or "", styleN),
            Paragraph(str(trabajo.fk_company) if trabajo.fk_company else "-", styleN),
            Paragraph(trabajador.get_full_name() if trabajador else "-", styleN),
            Paragraph(cliente.get_full_name() if cliente else "-", styleN),
            Paragraph(servicios, styleN),
            Paragraph(trabajo.description or "", styleN),
            Paragraph(estado, styleN),
        ])

    # Anchos de columna (ajustados)
    page_width = letter[0] - doc.leftMargin - doc.rightMargin
    proportions = [0.04, 0.13, 0.13, 0.14, 0.14, 0.14, 0.16, 0.12]
    col_widths = [page_width * p for p in proportions]

    # Tabla
    table = Table(data, repeatRows=1, colWidths=col_widths, hAlign='CENTER')
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f0f0f0")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
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
    from work_plan.models import WorkPlan
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
    
    # Datos del trabajador encargado
    trabajador = trabajo.fk_worker
    telefono_trabajador = ""
    if trabajador:
        try:
            telefono_trabajador = trabajador.userprofile.phone or ""
        except Exception:
            telefono_trabajador = ""
    datos_trabajador = [
        [Paragraph("<b>Trabajador Encargado</b>", styleB)],
        [Paragraph(f"<b>Nombre:</b> {trabajador.get_full_name() if trabajador else ''}", styleN)],
        [Paragraph(f"<b>Email:</b> {trabajador.email if trabajador else ''}", styleN)],
        [Paragraph(f"<b>Teléfono:</b> {telefono_trabajador}", styleN)],
    ]
    trabajador_table = Table(datos_trabajador, colWidths=[doc.width])
    trabajador_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.8, colors.black),
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f0f0f0")),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(trabajador_table)
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

    # Estado del trabajo (corregido)
    ESTADOS = {0: "Pendiente", 1: "Programado", 2: "En Proceso", 3: "Terminado"}
    estado = ESTADOS.get(trabajo.status, "Desconocido")
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

    # --- Plan de trabajo asociado ---
    plan = WorkPlan.objects.filter(fk_works_to_do=trabajo).order_by('-id').first()
    if plan:
        plan_estado = "Terminado" if plan.status else "Abierto"
        elements.append(Paragraph(f"<b>Plan de Trabajo Asociado</b>", styleB))
        elements.append(Paragraph(f"<b>Nombre:</b> {plan.plan_name}", styleN))
        elements.append(Paragraph(f"<b>Estado:</b> {plan_estado}", styleN))
        elements.append(Spacer(1, 6))

        # Tareas del plan
        tasks = plan.task_set.all()
        if tasks.exists():
            task_data = [
                [Paragraph("<b>#</b>", styleN),
                 Paragraph("<b>Tarea</b>", styleN),
                 Paragraph("<b>Requerimientos</b>", styleN),
                 Paragraph("<b>Inicio</b>", styleN),
                 Paragraph("<b>Fin</b>", styleN),
                 Paragraph("<b>Estado</b>", styleN)]
            ]
            for idx, t in enumerate(tasks, 1):
                reqs = ", ".join([r.requirement for r in t.requirements.all()])
                estado_tarea = "Terminada" if t.finished else "Pendiente"
                task_data.append([
                    Paragraph(str(idx), styleN),
                    Paragraph(t.task, styleN),
                    Paragraph(reqs, styleN),
                    Paragraph(t.start_date.strftime("%d/%m/%Y %H:%M") if t.start_date else "", styleN),
                    Paragraph(t.end_date.strftime("%d/%m/%Y %H:%M") if t.end_date else "", styleN),
                    Paragraph(estado_tarea, styleN)
                ])
            task_table = Table(task_data, repeatRows=1, hAlign='LEFT')
            task_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f0f0f0")),
                ('GRID', (0, 0), (-1, -1), 0.8, colors.black),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('FONTSIZE', (0, 1), (-1, -1), 9),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
                ('ALIGN', (0, 1), (-1, -1), 'LEFT'),
            ]))
            elements.append(task_table)
        else:
            elements.append(Paragraph("No hay tareas registradas para este plan.", styleN))
        elements.append(Spacer(1, 12))
    else:
        elements.append(Paragraph("No hay plan de trabajo registrado para esta solicitud.", styleN))
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