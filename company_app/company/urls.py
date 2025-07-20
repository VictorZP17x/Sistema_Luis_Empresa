from django.urls import path
from . import views

app_name = 'company'
urlpatterns = [
    path("", views.company, name="company"),
    path("delete/<int:pk>/", views.delete_company, name="delete_company"),
    path("edit/<int:pk>/", views.edit_company, name="edit_company"),
]