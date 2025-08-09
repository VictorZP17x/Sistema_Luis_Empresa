from django.urls import path
from . import views

urlpatterns = [
    path('', views.notifications_view, name='notifications'),
    path('get/', views.get_notifications, name='get_notifications'),
    path('mark_read/', views.mark_notification_read, name='mark_notification_read'),  # <--- Añade esta línea
]