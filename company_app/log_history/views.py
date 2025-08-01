from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def log_history(request):
    return render(request, 'log_history.html', {
    })