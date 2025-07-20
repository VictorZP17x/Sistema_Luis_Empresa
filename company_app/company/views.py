from django.shortcuts import render, redirect
from .models import Company
from .forms import CompanyForm
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
def company(request):
    if request.method == 'POST':
        form = CompanyForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('company:company')
    else:
        form = CompanyForm()
    companies = Company.objects.all()
    return render(request, 'company.html', {
        'company': companies,
        'form': form,
    })
    
def delete_company(request, pk):
    if request.method == "POST":
        try:
            company = Company.objects.get(pk=pk)
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
            company.save()
            return JsonResponse({'success': True})
        except Company.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Empresa no encontrada'})
    return JsonResponse({'success': False, 'error': 'Método no permitido'})

