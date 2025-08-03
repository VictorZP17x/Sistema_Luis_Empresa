from django.urls import path
from . import views

app_name = 'workers'
urlpatterns = [
    path("", views.workers, name="workers"),
    path('add_worker/', views.add_worker, name='add_worker'),
]