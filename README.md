# Application de Facturation

Application web de gestion de facturation développée avec Django.

## 👥 Chefs d'équipe

- `authentification` + `gestionnaire` : Tchinda (chef), Miguel (sous-chef)
- `caisse` : Charles, Ange Trecy
- `phone` : Nghomsi

## 🗃️ Modèle de données

### 🔑 Entités principales

#### 1. Client
- **📝 Description** : Représente un client de l'entreprise
- **📋 Champs** :
  - `nom` : Nom du client (obligatoire)
  - `type` : Type de client (professionnel/particulier, optionnel)
  - `email` : Adresse email (unique, optionnel)
  - `telephone` : Numéro de téléphone (optionnel)

#### 2. Utilisateur
- **📝 Description** : Compte utilisateur pour l'accès au système
- **📋 Champs** :
  - `login` : Identifiant de connexion (unique)
  - `mot_de_passe` : Mot de passe (hashé)
  - `role` : Rôle de l'utilisateur (admin, caissier, etc.)
  - `actif` : Statut du compte

#### 3. Article
- **📝 Description** : Produit en vente
- **📋 Champs** :
  - `code_barres` : Code-barres unique
  - `nom` : Désignation de l'article
  - `prix_HT` : Prix hors taxes
  - `prix_TTC` : Toutes taxes comprises
  - `stock_actuel` : Quantité en stock
  - `stock_minimum` : Seuil d'alerte de stock
  - `actif` : Article actif ou non

### 💰 Transactions

#### 4. Facture
- **📝 Description** : Document de vente
- **🔗 Relations** :
  - `client` : Référence au client (obligatoire)
  - `caissier` : Utilisateur ayant créé la facture
- **📋 Champs** :
  - `date` : Date de création (auto)
  - `montant` : Montant total de la facture

#### 5. DetailFacture
- **📝 Description** : Ligne de détail d'une facture
- **🔗 Relations** :
  - `facture` : Facture parente (obligatoire)
  - `article` : Article concerné
- **📋 Champs** :
  - `quantite` : Quantité vendue
  - `prix_unitaire` : Prix à l'unité
  - `remise` : Remise appliquée (%)
  - `total_ligne` : Total de la ligne (calculé)

### 📊 Autres entités

#### 6. Retour
- **📝 Description** : Retour d'articles
- **🔗 Relations** :
  - `facture` : Facture d'origine
  - `article` : Article retourné
- **📋 Champs** :
  - `quantite_retournee` : Quantité retournée
  - `raison` : Motif du retour
  - `type` : Type de retour (remboursement, échange, etc.)

#### 7. Audit
- **📝 Description** : Journal des actions utilisateurs
- **🔗 Relations** :
  - `utilisateur` : Auteur de l'action
- **📋 Champs** :
  - `type_action` : Type d'action effectuée
  - `date_action` : Date de l'action (auto)
  - `description` : Détails de l'action

## ✨ Fonctionnalités

- Authentification des utilisateurs
- Gestion des clients via le module `phone`
- Gestion de caisse via le module `caisse`
- Menu latéral et navigation via le module `gestionnaire`

## 🧰 Technologies utilisées

- Django 6 (backend)
- PostgreSQL (base de données)
- Tailwind via `django-tailwind`
- Scan temps réel côté navigateur : `@zxing/browser`
- Scan d’images côté serveur : `pyzbar` + `Pillow`
- Dépendance système (Linux) : `zbar` pour `pyzbar`

## 📋 Prérequis

- Python 3.8+
- PostgreSQL 12+
- `zbar` (pour le scan d’images via `pyzbar`)

### 🔧 Configuration de PostgreSQL

1. **📦 Installation**
   - Sous Ubuntu/Debian :
     ```bash
     sudo apt update
     sudo apt install postgresql postgresql-contrib
     ```
   - Sous macOS (avec Homebrew) :
     ```bash
     brew install postgresql
     ```

2. **💾 Création de la base de données**
   ```bash
   # Se connecter à PostgreSQL
   sudo -u postgres psql
   
   # Créer un utilisateur (si nécessaire)
   CREATE USER mon_utilisateur WITH PASSWORD 'mon_mot_de_passe' CREATEDB;
   
   # Créer la base de données
   CREATE DATABASE facturation OWNER mon_utilisateur;
   
   # Accorder les privilèges
   GRANT ALL PRIVILEGES ON DATABASE facturation TO mon_utilisateur;
   
   # Quitter psql
   \q
   ```


3. **🐍 Installation du connecteur Python**
Le package `psycopg2-binary` est déjà inclus dans `requirements.txt`

## 🚀 Installation

1. Cloner le dépôt :
   ```bash
   git clone [URL_DU_REPO]
   cd facturation
   ```

2. Créer un environnement virtuel et l'activer :
   ```bash
   python -m venv venv
   source venv/bin/activate  # Sur Linux/Mac
   # ou
   .\venv\Scripts\activate  # Sur Windows
   ```

3. Installer les dépendances :
   ```bash
   pip install -r requirements.txt
   ```

4. Configurer les variables d'environnement :
   Créer un fichier `.env` à la racine du projet avec les variables nécessaires (voir la section Configuration).

5. Appliquer les migrations :
   ```bash
   python manage.py migrate
   ```

6. Démarrer le serveur de développement :
   
   Utilisez le script `run.sh` pour démarrer à la fois le serveur Django et le watcher Tailwind dans un seul terminal :
   ```bash
   # Rendre le script exécutable (une seule fois)
   chmod +x run.sh
   
   # Démarrer le serveur
   ./run.sh
   ```
   
   Ce script démarre automatiquement :
   - Le serveur de développement Django
   - Le watcher Tailwind pour la compilation des fichiers CSS
   
   Appuyez sur `Ctrl+C` pour arrêter proprement les deux processus.

## Configuration

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
SECRET_KEY = votre_secret_key
DEBUG=True

# Paramètres de la BD
DB_NAME = facturation
DB_USER = user_name
DB_PASSWORD = password
DB_HOST = localhost
PORT = 5432
```

## 📁 Structure du projet

```text
facturation/
├── apps/
│   ├── authentification/    # Gestion des utilisateurs et authentification
│   ├── phone/               # Gestion des contacts
│   ├── caisse/              # Gestion des paiements
│   └── gestionnaire/        # Fonctionnalités de base
├── facturation/             # Configuration du projet
├── media/                   # Fichiers téléchargés
├── static/                  # Fichiers statiques
├── templates/               # Templates HTML
└── theme/                   # Thème et assets
```

## 🧩 Modules

- `authentification` : Connexion et inscription
- `phone` : Scanner les codes-barres et QR pour en extraire le texte
- `caisse` : Encaissements et ventes
- `gestionnaire` : Navigation et menu latéral

## 🌐 Routes principales

- `authentification/` : pages login/signup
- `phone/` : pages clients
- `caisse/` : pages de caisse

## 💻 Développement

### 🎨 Configuration de Tailwind CSS

Ce projet utilise `django-tailwind`, une intégration de Tailwind CSS pour Django qui ne nécessite pas Node.js.

#### ⚙️ Installation et configuration

1. Installation du package :
   ```bash
   pip install django-tailwind
   ```

2. Initialisation de Tailwind :
   ```bash
   python manage.py tailwind init
   ```

3. Installation des dépendances :
   ```bash
   python manage.py tailwind install
   ```

#### 🛠️ Développement

- Utilisez le script `run.sh` pour démarrer le serveur de développement et le watcher Tailwind en une seule commande.
- Les fichiers de configuration se trouvent dans le dossier `theme/`
- Les fichiers CSS générés sont disponibles dans `static_src/` et copiés automatiquement vers `static/`
- Pour les modifications CSS, Tailwatch surveille automatiquement les changements et recompile les fichiers nécessaires

## 👥 Travail d'équipe et bonnes pratiques

### 🏗️ Architecture modulaire

Ce projet suit une architecture modulaire où chaque équipe peut travailler sur un module spécifique de manière indépendante. Voici comment collaborer efficacement :

#### 📂 Structure des modules

Chaque module se trouve dans le dossier `apps/` et contient :
```text
mon_module/
├── migrations/     # Migrations spécifiques au module
├── static/         # Fichiers statiques du module
├── templates/      # Templates spécifiques au module
├── __init__.py
├── admin.py       # Configuration admin
├── apps.py        # Configuration de l'application
├── models.py      # Modèles
├── urls.py        # URLs du module
└── views.py       # Vues du module
```

#### ✅ Bonnes pratiques pour les équipes

1. **👥 Un module = Une équipe**
   - Chaque équipe est responsable d'un des 4 modules (`authentification`, `phone`, `caisse`, `gestionnaire`)
   - Les dépendances entre modules doivent être minimales et bien documentées

2. **🏷️ Espaces de noms**
   - Utilisez des namespaces pour les URLs : `path('mon-module/', include(('mon_module.urls', 'mon_module'), namespace='mon_module'))`
   - Préfixez les noms des templates : `mon_module/nom_du_template.html`

#### 🎯 Avantages de cette architecture

- **Développement parallèle** : Plusieurs équipes peuvent travailler simultanément sur différents modules
- **Maintenabilité** : Le code est mieux organisé et plus facile à maintenir
- **Évolutivité** : Nouveaux modules faciles à ajouter sans impacter les fonctionnalités existantes
- **Réutilisation** : Les modules peuvent être réutilisés dans d'autres projets Django
- **Isolation** : Les problèmes sont contenus dans leur module respectif

## 📄 Licence

Ce projet est sous licence MIT.
