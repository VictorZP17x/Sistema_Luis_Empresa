from django.urls import path
from . import views

app_name = 'personal_data'
urlpatterns = [
    path("", views.personal_data, name="personal_data"),
]