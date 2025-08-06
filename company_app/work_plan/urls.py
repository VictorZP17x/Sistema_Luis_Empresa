from django.urls import path
from . import views

app_name = 'work_plan'
urlpatterns = [
    path("", views.work_plan, name="work_plan"),
    path("work_plan_create/", views.work_plan_create, name="work_plan_create"),
    path("update/<int:pk>/", views.work_plan_update, name="work_plan_update"),
    path("delete/<int:pk>/", views.work_plan_delete, name="work_plan_delete"),
    path("task_create/", views.task_create, name="task_create"),
    path("tasks_by_work_plan/<int:plan_id>/", views.tasks_by_work_plan, name="tasks_by_work_plan"),
    path("task_update/<int:pk>/", views.task_update, name="task_update"),
    path("task_delete/<int:pk>/", views.task_delete, name="task_delete"),
    path('task_finish/<int:pk>/', views.task_finish, name='task_finish'),
    path('get_observation/<int:pk>/', views.get_observation, name='get_observation'),
    path('progress_by_works_to_do/<int:works_to_do_id>/', views.progress_by_works_to_do, name='progress_by_works_to_do'),
    path('generate-pdf/<int:pk>/', views.generate_pdf_work_plan, name='generate_pdf_work_plan'),
]