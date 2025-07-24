from django.urls import path, include
from . import views
from client import views as client_views
from company import views as company_views
from log_history import views as log_history_views
from user import views as user_views
from work_type import views as work_type_views
from works_to_do import views as works_to_do_views
from django.contrib.auth import views as auth_views
from django.contrib import admin

app_name = 'home'
urlpatterns = [
    path("", views.home, name="home"),
    path("dashboard/", views.dashboard, name="dashboard"),
    path("client/", client_views.client, name="client"),
    path("company/", company_views.company, name="company"),
    path("log_history/", log_history_views.log_history, name="log_history"),
    path("user/", user_views.user, name="user"),
    path("work_type/", work_type_views.work_type, name="work_type"),
    path("works_to_do/", works_to_do_views.works_to_do, name="works_to_do"),
    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),
    path('admin/', admin.site.urls),
]