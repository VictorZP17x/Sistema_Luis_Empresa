from django.shortcuts import render
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from user.models import UserProfile
from .forms import UserForm
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
import os
import datetime
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from django.conf import settings
import json
from django.contrib.auth.decorators import login_required

@login_required
def user(request):
    user_profiles = UserProfile.objects.filter(role__in=[0, 1])
    if request.user.is_authenticated:
        user_profiles = user_profiles.exclude(user=request.user)
    users = [profile.user for profile in user_profiles]

    form = UserForm(request.POST or None)
    if request.method == "POST":
        if form.is_valid():
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password")
            first_name = form.cleaned_data.get("first_name")
            last_name = form.cleaned_data.get("last_name")
            email = form.cleaned_data.get("email")
            phone = form.cleaned_data.get("phone")

            user = User(
                username=username,
                first_name=first_name,
                last_name=last_name,
                email=email
            )
            user.set_password(password)
            user.save()
            UserProfile.objects.create(user=user, role=1, phone=phone)
            if request.headers.get("x-requested-with") == "XMLHttpRequest":
                return JsonResponse({"success": True})
            return redirect("user:user")
        else:
            if request.headers.get("x-requested-with") == "XMLHttpRequest":
                return JsonResponse({"success": False, "errors": form.errors})

    return render(request, "user.html", {
        "users": users,
        "form": form,
    })

@login_required
@csrf_exempt
def edit_user(request):
    if request.method == "POST" and request.headers.get("x-requested-with") == "XMLHttpRequest":
        user_id = request.POST.get("user_id")
        username = request.POST.get("username")
        password = request.POST.get("password")
        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")
        email = request.POST.get("email")
        phone = request.POST.get("phone")

        try:
            user = User.objects.get(pk=user_id)
            user.username = username
            user.first_name = first_name
            user.last_name = last_name
            user.email = email
            if password:
                user.password = make_password(password)
            user.save()
            profile = UserProfile.objects.get(user=user)
            profile.phone = phone
            profile.save()
            return JsonResponse({"success": True})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})
    return JsonResponse({"success": False, "error": "Petición inválida"})

@login_required
@csrf_exempt
def delete_user(request, user_id):
    if request.method == "POST" and request.headers.get("x-requested-with") == "XMLHttpRequest":
        try:
            user = User.objects.get(pk=user_id)
            user.delete()
            return JsonResponse({"success": True})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})
    return JsonResponse({"success": False, "error": "Petición inválida"})

@login_required
@csrf_exempt
def toggle_role(request, user_id):
    if request.method == "POST" and request.headers.get("x-requested-with") == "XMLHttpRequest":
        try:
            profile = UserProfile.objects.get(user__id=user_id)
            # Cambia entre 1 (usuario) y 0 (admin)
            if profile.role == 1:
                profile.role = 0
            else:
                profile.role = 1
            profile.save()
            return JsonResponse({"success": True, "new_role": profile.role})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})
    return JsonResponse({"success": False, "error": "Petición inválida"})

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
def generate_pdf_users(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="Reporte_Usuarios.pdf"'

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
    title = Paragraph("Usuarios", styles['Title'])

    # Cabecera con logo y título
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
            Paragraph("<b>Usuario</b>", styleN),
            Paragraph("<b>Nombre</b>", styleN),
            Paragraph("<b>Apellido</b>", styleN),
            Paragraph("<b>Email</b>", styleN),
            Paragraph("<b>Teléfono</b>", styleN),
            Paragraph("<b>Rol</b>", styleN),
        ]
    ]

    # Datos de la tabla
    user_profiles = UserProfile.objects.filter(role__in=[0, 1]).select_related('user')
    ROLES = {0: "Administrador", 1: "Empleado"}
    for idx, profile in enumerate(user_profiles, 1):
        user = profile.user
        data.append([
            Paragraph(str(idx), styleN),
            Paragraph(user.username or "", styleN),
            Paragraph(user.first_name or "", styleN),
            Paragraph(user.last_name or "", styleN),
            Paragraph(user.email or "", styleN),
            Paragraph(profile.phone or "", styleN),
            Paragraph(ROLES.get(profile.role, "Desconocido"), styleN),
        ])

    # Calcular el ancho total disponible
    page_width = letter[0] - doc.leftMargin - doc.rightMargin
    proportions = [0.06, 0.13, 0.16, 0.15, 0.18, 0.16, 0.14]
    col_widths = [page_width * p for p in proportions]

    # Crear la tabla centrada y ocupando el ancho disponible
    table = Table(data, repeatRows=1, colWidths=col_widths, hAlign='CENTER')

    # Estilos de la tabla
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
@csrf_exempt
def validar_datos_usuario(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        phone = data.get('phone')
        user_id = data.get('user_id')  # Para edición

        errores = []
        # Excluir el propio usuario en edición
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