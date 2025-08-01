from django.urls import path
from . import views

app_name = 'personal_data'
urlpatterns = [
    path("", views.personal_data, name="personal_data"),
    path("validar_datos_personales/", views.validar_datos_personales, name="validar_datos_personales"),
]