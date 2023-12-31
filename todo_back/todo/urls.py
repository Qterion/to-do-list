from django.urls import path
from .views import *

urlpatterns=[
    path('',ListTodo.as_view()),
    path('<int:pk>/',DetailTodo.as_view()),
    path('edit/<int:pk>/',TodoPatchView.as_view()),
    path('create/',CreateTodo.as_view()),
    path('delete/<int:pk>/',DeleteTodo.as_view()),
    path('delete/file/<int:file_id>/',DeleteTodoFile.as_view()),
    path('download/file/<int:file_id>/',DownloadTodoFile.as_view()),
]