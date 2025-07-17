from django.shortcuts import render
# from django.contrib.auth.decorators import login_required

# @login_required
def works_to_do(request):
    return render(request, 'works_to_do.html', {
    })