from django.urls import path, include
from todo.views import *

urlpatterns=[
    path('account/',include('account.urls')),
    path('todo/',include('todo.urls')),
]