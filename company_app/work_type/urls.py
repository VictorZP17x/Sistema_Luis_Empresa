from django.urls import path
from . import views

app_name = 'work_type'
urlpatterns = [
    path("", views.work_type, name="work_type"),
]