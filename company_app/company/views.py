from django.shortcuts import render
# from django.contrib.auth.decorators import login_required

# @login_required
def company(request):
    return render(request, 'company.html', {
    })