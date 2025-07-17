from django.shortcuts import render
# from django.contrib.auth.decorators import login_required

# @login_required
def client(request):
    return render(request, 'client.html', {
    })