from django.urls import path
from . import views

app_name = 'client'
urlpatterns = [
    path("", views.client, name="client"),
    path("edit_client/", views.edit_client, name="edit_client"),
    path("delete_client/<int:client_id>/", views.delete_client, name="delete_client"),  
    path('generate-pdf/', views.generate_pdf_clients, name='generate_pdf_clients'),
]