from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.db import models
from facturation.models import Article, Client, Facture, DetailFacture, Utilisateur
from decimal import Decimal
import json

def index(request):
    """Vue principale de la caisse"""
    # Données de démonstration pour le caissier
    context = {
        'caissier_nom': 'Marie Dubois',
        'caissier_role': 'Caissière'
    }
    return render(request, 'caisse/index.html', context)

@require_http_methods(["GET"])
def search_articles(request):
    """Recherche d'articles par nom ou code-barres"""
    query = request.GET.get('q', '')
    
    if not query:
        return JsonResponse({'articles': []})
    
    # Recherche dans les articles actifs
    articles = Article.objects.filter(
        actif=True
    ).filter(
        models.Q(nom__icontains=query) | 
        models.Q(code_barres__icontains=query)
    )[:10]
    
    articles_data = [{
        'id': article.id,
        'nom': article.nom,
        'code_barres': article.code_barres,
        'prix_ttc': float(article.prix_TTC),
        'prix_ht': float(article.prix_HT),
        'stock': article.stock_actuel
    } for article in articles]
    
    return JsonResponse({'articles': articles_data})

@require_http_methods(["POST"])
def create_facture(request):
    """Créer une nouvelle facture"""
    try:
        data = json.loads(request.body)
        items = data.get('items', [])
        
        if not items:
            return JsonResponse({'error': 'Panier vide'}, status=400)
        
        # Calculer le montant total
        montant_total = sum(Decimal(str(item['total'])) for item in items)
        
        # Créer un client par défaut ou récupérer un client existant
        client, _ = Client.objects.get_or_create(
            nom='Client Anonyme',
            defaults={'type': 'particulier'}
        )
        
        # Créer la facture
        facture = Facture.objects.create(
            montant=montant_total,
            client=client,
            caissier=None  
        )
        
        # Créer les détails de facture
        for item in items:
            article = Article.objects.get(id=item['article_id'])
            DetailFacture.objects.create(
                facture=facture,
                article=article,
                quantite=item['quantite'],
                prix_unitaire=Decimal(str(item['prix_unitaire'])),
                remise=Decimal(str(item.get('remise', 0))),
                total_ligne=Decimal(str(item['total']))
            )
            
            # Mettre à jour le stock
            article.stock_actuel -= item['quantite']
            article.save()
        
        return JsonResponse({
            'success': True,
            'facture_id': facture.id,
            'numero_facture': f'FAC-{facture.id:08d}'
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
