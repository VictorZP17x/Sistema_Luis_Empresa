from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.shortcuts import redirect
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path("home/", include("home.urls")),
    path("login/", include("login.urls")),
    path('', lambda request: redirect('login:login')),
    path("client/", include("client.urls")),
    path("company/", include("company.urls")),
    path("log_history/", include("log_history.urls")),
    path("user/", include("user.urls")),
    path("work_type/", include("work_type.urls")),
    path("works_to_do/", include("works_to_do.urls")),

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)