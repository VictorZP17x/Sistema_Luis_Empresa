from django.urls import path
from . import views

app_name = 'log_history'
urlpatterns = [
    path("", views.log_history, name="log_history"),
]