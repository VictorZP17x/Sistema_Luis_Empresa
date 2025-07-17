from django.shortcuts import render
# from django.contrib.auth.decorators import login_required

# @login_required
def work_type(request):
    return render(request, 'work_type.html', {
    })