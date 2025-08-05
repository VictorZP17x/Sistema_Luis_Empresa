from django.urls import path
from . import views

app_name = 'workers'
urlpatterns = [
    path("", views.workers, name="workers"),
    path('add_worker/', views.add_worker, name='add_worker'),
    path('edit_worker/', views.edit_worker, name='edit_worker'),
    path('delete/<int:user_id>/', views.delete_worker, name='delete_worker'), 
    path('validar_datos_trabajador/', views.validar_datos_trabajador, name='validar_datos_trabajador'),
]