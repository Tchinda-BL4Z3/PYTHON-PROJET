from django.urls import path
from . import views

app_name = 'caisse'

urlpatterns = [
    path('', views.index, name='index'),
    path('api/search/', views.search_articles, name='search_articles'),
    path('api/facture/create/', views.create_facture, name='create_facture'),
]
