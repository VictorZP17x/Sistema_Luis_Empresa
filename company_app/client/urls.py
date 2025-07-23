from django.urls import path
from . import views

app_name = 'client'
urlpatterns = [
    path("", views.client, name="client"),
    path("edit_client/", views.edit_client, name="edit_client"),
]