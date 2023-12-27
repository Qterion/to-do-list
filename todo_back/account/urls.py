from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenBlacklistView
urlpatterns=[
    path('register/',RegisterView.as_view()),
    path('login/',LoginView.as_view()),
    path('logout/', TokenBlacklistView.as_view(), name='token_blacklist'),
]