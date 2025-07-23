from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from user.models import UserProfile
from .forms import ClientForm
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password

def client(request):
    client_profiles = UserProfile.objects.filter(role=2)
    clients = [profile.user for profile in client_profiles]

    form = ClientForm(request.POST or None)
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
            UserProfile.objects.create(user=user, role=2, phone=phone)
            if request.headers.get("x-requested-with") == "XMLHttpRequest":
                return JsonResponse({"success": True})
            return redirect("client:client")
        else:
            if request.headers.get("x-requested-with") == "XMLHttpRequest":
                return JsonResponse({"success": False, "errors": form.errors})

    return render(request, "client.html", {
        "clients": clients,
        "form": form,
    })
    
@csrf_exempt
def edit_client(request):
    if request.method == "POST" and request.headers.get("x-requested-with") == "XMLHttpRequest":
        client_id = request.POST.get("client_id")
        username = request.POST.get("username")
        password = request.POST.get("password")
        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")
        email = request.POST.get("email")
        phone = request.POST.get("phone")

        try:
            user = User.objects.get(pk=client_id)
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