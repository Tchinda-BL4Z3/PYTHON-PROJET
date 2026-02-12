from django.urls import path
from . import views

app_name = 'authentification'

urlpatterns = [
    path('login/', views.login_view, name='login'),
    # Route pour l'inscription : pointe vers signup_view (précédemment corrigé de create_view)
    path('signup/', views.signup_view, name='signup'),
]
