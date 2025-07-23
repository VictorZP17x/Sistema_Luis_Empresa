from django.urls import path
from . import views

app_name = 'work_type'
urlpatterns = [
    path("", views.work_type, name="work_type"),
    path("delete/<int:pk>/", views.delete_service, name="delete_service"),
    path("generate_pdf/", views.generate_pdf, name="generate_pdf"),
    path("edit_service/", views.edit_service, name="edit_service"), 

]