from django.urls import path
from .views import login_view, logout_view, user_info, change_password, get_csrf_token

urlpatterns = [
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('user/', user_info, name='user_info'),
    path('change-password/', change_password, name='change_password'),
    path('csrf/', get_csrf_token, name='csrf_token'),
]
