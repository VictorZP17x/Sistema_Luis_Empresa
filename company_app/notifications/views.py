from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Notification


@login_required
def notifications_view(request):
    return render(request, 'notifications.html')

@login_required
def get_notifications(request):
    notificaciones = request.user.notifications.filter(is_read=False).order_by('-created_at')[:10]
    data = [
        {
            'id': n.id,
            'mensaje': n.message,
            'fecha': n.created_at.strftime('%d/%m/%Y'),
        }
        for n in notificaciones
    ]
    return JsonResponse({'notificaciones': data})

@login_required
@csrf_exempt
def mark_notification_read(request):
    if request.method == "POST":
        notif_id = request.POST.get("id")
        Notification.objects.filter(id=notif_id, user=request.user).update(is_read=True)
        return JsonResponse({"success": True})
    return JsonResponse({"success": False}, status=400)