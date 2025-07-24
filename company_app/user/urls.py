from django.urls import path
from . import views

app_name = 'user'
urlpatterns = [
    path("", views.user, name="user"),
    path("edit_user/", views.edit_user, name="edit_user"),
    path("delete_user/<int:user_id>/", views.delete_user, name="delete_user"),
    path("toggle_role/<int:user_id>/", views.toggle_role, name="toggle_role"),
    path("generate-pdf/", views.generate_pdf_users, name="generate_pdf_users"),
]