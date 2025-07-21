from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from . import views

app_name = 'company'
urlpatterns = [
    path("", views.company, name="company"),
    path("delete/<int:pk>/", views.delete_company, name="delete_company"),
    path("edit/<int:pk>/", views.edit_company, name="edit_company"),
    path('generate-pdf/', views.generate_pdf, name='generate_pdf'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)