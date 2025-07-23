from django.urls import path
from . import views

app_name = 'works_to_do'
urlpatterns = [
    path("", views.works_to_do, name="works_to_do"),
    path("add_works_to_do/", views.add_works_to_do, name="add_works_to_do"),
    path("edit_works_to_do/", views.edit_works_to_do, name="edit_works_to_do"),
    path("delete_works_to_do/", views.delete_works_to_do, name="delete_works_to_do"),
]