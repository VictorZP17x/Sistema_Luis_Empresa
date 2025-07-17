from django.urls import path
from . import views

app_name = 'works_to_do'
urlpatterns = [
    path("", views.works_to_do, name="works_to_do"),
]