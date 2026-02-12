from django.core.management.base import BaseCommand
from facturation.models import Article, Client, Utilisateur
from decimal import Decimal

class Command(BaseCommand):
    help = 'Charge des données de test pour la caisse'

    def handle(self, *args, **kwargs):
        articles_data = [
            {
                'code_barres': '3760123450001',
                'nom': 'Pain de campagne',
                'prix_HT': Decimal('2.84'),
                'prix_TTC': Decimal('3.00'),
                'stock_actuel': 49,
                'stock_minimum': 10,
            },
            {
                'code_barres': '3760123450002',
                'nom': 'Lait écrémé 1L',
                'prix_HT': Decimal('1.13'),
                'prix_TTC': Decimal('1.20'),
                'stock_actuel': 100,
                'stock_minimum': 20,
            },
            {
                'code_barres': '3760123450003',
                'nom': 'Tomates',
                'prix_HT': Decimal('2.83'),
                'prix_TTC': Decimal('2.99'),
                'stock_actuel': 75,
                'stock_minimum': 15,
            },
            {
                'code_barres': '3760123450004',
                'nom': 'Poulet',
                'prix_HT': Decimal('11.32'),
                'prix_TTC': Decimal('12.00'),
                'stock_actuel': 30,
                'stock_minimum': 5,
            },
            {
                'code_barres': '3760123450005',
                'nom': 'Fromage comté',
                'prix_HT': Decimal('8.49'),
                'prix_TTC': Decimal('9.00'),
                'stock_actuel': 45,
                'stock_minimum': 10,
            },
            {
                'code_barres': '3760123450006',
                'nom': 'Yaourt nature x8',
                'prix_HT': Decimal('2.26'),
                'prix_TTC': Decimal('2.40'),
                'stock_actuel': 60,
                'stock_minimum': 15,
            },
            {
                'code_barres': '3760123450007',
                'nom': 'Pâtes spaghetti 500g',
                'prix_HT': Decimal('1.13'),
                'prix_TTC': Decimal('1.20'),
                'stock_actuel': 120,
                'stock_minimum': 30,
            },
            {
                'code_barres': '3760123450008',
                'nom': 'Huile d\'olive 1L',
                'prix_HT': Decimal('7.55'),
                'prix_TTC': Decimal('8.00'),
                'stock_actuel': 35,
                'stock_minimum': 8,
            },
        ]

        for article_data in articles_data:
            article, created = Article.objects.get_or_create(
                code_barres=article_data['code_barres'],
                defaults=article_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Article créé: {article.nom}'))
            else:
                self.stdout.write(self.style.WARNING(f'Article existe déjà: {article.nom}'))

        # Créer un client par défaut
        client, created = Client.objects.get_or_create(
            nom='Client Anonyme',
            defaults={
                'type': 'particulier',
                'email': None,
                'telephone': None
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('Client par défaut créé'))

        # Créer un utilisateur caissier
        utilisateur, created = Utilisateur.objects.get_or_create(
            login='marie.dubois',
            defaults={
                'mot_de_passe': 'password123',  # À hasher en production
                'role': 'caissier',
                'actif': True
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('Utilisateur caissier créé'))

        self.stdout.write(self.style.SUCCESS('Données de test chargées avec succès !'))
