# Guide de Test de l'Interface de Caisse

## Démarrage Rapide

### 1. Vérifier que les serveurs sont lancés

Les deux serveurs doivent être actifs :
- **Django** : http://127.0.0.1:8000
- **Tailwind** : Compilation CSS en temps réel

Si ce n'est pas le cas :
```bash
# Terminal 1 - Django
venv\Scripts\python manage.py runserver

# Terminal 2 - Tailwind
venv\Scripts\python manage.py tailwind start
```

### 2. Accéder à l'interface

Ouvrir dans votre navigateur : **http://127.0.0.1:8000/caisse/**

## Scénarios de Test

### Test 1 : Scanner un Article
1. Cliquer dans la barre de recherche en haut
2. Taper : `3760123450001` (Pain de campagne)
3. Appuyer sur **Entrée**
4. L'article apparaît dans le panier avec quantité 1

### Test 2 : Recherche Manuelle
1. Cliquer sur le bouton **"Ajouter"** (ou appuyer sur **F1**)
2. Dans la modal, taper : `lait`
3. Les résultats s'affichent en temps réel
4. Cliquer sur "Lait demi-écrémé 1L"
5. L'article est ajouté au panier
6. La modal se ferme automatiquement

### Test 3 : Modifier les Quantités
1. Ajouter un article au panier
2. Cliquer sur le bouton **+** à droite de l'article
3. La quantité augmente
4. Le prix total de la ligne se met à jour
5. Le récapitulatif (HT, TVA, TTC) se met à jour
6. Cliquer sur le bouton **-**
7. La quantité diminue

### Test 4 : Supprimer un Article
1. Ajouter plusieurs articles au panier
2. Cliquer sur l'icône **poubelle** d'un article
3. L'article est supprimé du panier
4. Les totaux se recalculent

### Test 5 : Panier Vide
1. Vider complètement le panier
2. Message "Le panier est vide" s'affiche
3. Icône de panier grisée
4. Bouton "Paiement" est désactivé (grisé)

### Test 6 : Processus de Paiement
1. Ajouter au moins un article au panier
2. Cliquer sur **"Paiement"** (ou appuyer sur **F5**)
3. Modal de ticket de caisse s'ouvre
4. Affiche :
   - Numéro de facture (FAC-XXXXXXXX)
   - Date et heure actuelles
   - Liste des articles avec quantités
   - Totaux HT, TVA, TTC
   - Message "Merci de votre visite !"
5. Cliquer sur **"Imprimer"**
6. Dialogue d'impression s'ouvre
7. Cliquer sur **"Terminer"**
8. Panier se vide
9. Modal se ferme
10. Message de confirmation

### Test 7 : Raccourcis Clavier
1. Appuyer sur **F1**
   - Modal de recherche s'ouvre
2. Appuyer sur **ESC**
   - Modal se ferme
3. Ajouter des articles au panier
4. Appuyer sur **F5**
   - Modal de paiement s'ouvre
5. Appuyer sur **ESC** (avec panier non vide)
   - Demande de confirmation pour vider le panier

### Test 8 : Calculs Automatiques
1. Ajouter "Pain de campagne" (3.00 €)
2. Vérifier :
   - Total HT : 2.84 €
   - TVA : 0.16 €
   - Total TTC : 3.00 €
   - Nombre d'articles : 1
3. Augmenter la quantité à 2
4. Vérifier :
   - Total HT : 5.68 €
   - TVA : 0.32 €
   - Total TTC : 6.00 €
   - Nombre d'articles : 2

### Test 9 : Plusieurs Articles
1. Scanner : `3760123450001` (Pain - 3.00 €)
2. Scanner : `3760123450002` (Lait - 1.20 €)
3. Scanner : `3760123450003` (Tomates - 2.99 €)
4. Vérifier :
   - 3 lignes dans le panier
   - Total TTC : 7.19 €
   - Nombre d'articles : 3

### Test 10 : Interface Responsive
1. Vérifier que tous les éléments sont visibles
2. Sidebar à gauche (fixe)
3. Zone centrale (scrollable si nécessaire)
4. Panneau récapitulatif à droite (fixe)
5. Pas de débordement horizontal

## Éléments Visuels à Vérifier

### Sidebar
- [ ] Logo "SuperMarket POS" en haut
- [ ] Nom du caissier : "Marie Dubois"
- [ ] Rôle : "Caissière"
- [ ] Icône panier avec "Caisse" actif (fond blanc, bordure noire)
- [ ] Icône lune pour "Thème" en bas
- [ ] Icône déconnexion pour "Déconnexion" en bas

### Zone Centrale
- [ ] Titre "Caisse" en gros
- [ ] Barre de recherche avec icône loupe
- [ ] Placeholder : "Scanner ou saisir le code-barres..."
- [ ] Bouton "Ajouter" noir
- [ ] Titre "Panier (X articles)"
- [ ] Articles avec :
  - Nom en gras
  - Prix unitaire + TVA en petit
  - Boutons +/- avec bordures
  - Quantité au centre
  - Prix total à droite
  - Icône poubelle rouge au survol
- [ ] État vide : grande icône panier + texte

### Panneau Récapitulatif
- [ ] Titre "Récapitulatif"
- [ ] Total HT aligné à droite
- [ ] TVA aligné à droite
- [ ] Total TTC en gros et gras
- [ ] Badge bleu avec nombre d'articles
- [ ] Section "Raccourcis clavier" avec icône éclair
- [ ] Liste des raccourcis (F1, F2, F5, ESC)
- [ ] Grand bouton "Paiement" noir en bas
- [ ] Icône carte bancaire dans le bouton
- [ ] Icône point d'interrogation en bas

### Modals
- [ ] Fond semi-transparent avec flou
- [ ] Animation d'apparition (slide up)
- [ ] Bouton X pour fermer
- [ ] Recherche : champ + résultats
- [ ] Ticket : toutes les informations de la facture

## Problèmes Courants

### Le CSS ne s'applique pas
```bash
# Redémarrer Tailwind
Ctrl+C dans le terminal Tailwind
venv\Scripts\python manage.py tailwind start
```

### Les articles ne se chargent pas
```bash
# Recharger les données de test
venv\Scripts\python manage.py load_test_data
```

### Erreur 404 sur /caisse/
Vérifier que l'URL est bien : `http://127.0.0.1:8000/caisse/` (avec le slash final)

### Le JavaScript ne fonctionne pas
1. Ouvrir la console du navigateur (F12)
2. Vérifier s'il y a des erreurs
3. Vérifier que `static/js/caisse.js` est bien chargé

## Checklist Complète

- [ ] Interface se charge correctement
- [ ] Tous les styles sont appliqués
- [ ] Scanner un article fonctionne
- [ ] Recherche manuelle fonctionne
- [ ] Modifier quantité fonctionne
- [ ] Supprimer article fonctionne
- [ ] Calculs automatiques corrects
- [ ] Bouton Paiement s'active/désactive
- [ ] Modal de paiement s'affiche
- [ ] Ticket de caisse complet
- [ ] Raccourcis clavier fonctionnent
- [ ] Animations fluides
- [ ] Pas d'erreurs dans la console

## Captures d'Écran Attendues

### Vue Principale - Panier Vide
- Sidebar à gauche
- Zone centrale avec message "Le panier est vide"
- Récapitulatif à droite avec 0.00 €

### Vue Principale - Avec Articles
- Sidebar à gauche
- Zone centrale avec liste d'articles
- Chaque article avec contrôles de quantité
- Récapitulatif avec totaux calculés

### Modal de Recherche
- Fond flouté
- Fenêtre blanche centrée
- Champ de recherche en haut
- Liste de résultats en dessous

### Modal de Ticket
- Fond flouté
- Ticket de caisse stylisé
- Toutes les informations de la transaction
- Boutons Imprimer et Terminer

## Résultat Attendu

L'interface doit être **identique** aux images fournies :
- Même disposition (sidebar, centre, droite)
- Mêmes couleurs (noir, gris, blanc)
- Même typographie (Inter)
- Mêmes espacements
- Mêmes animations
- Même comportement

## Support

Si vous rencontrez des problèmes :
1. Vérifier que les deux serveurs sont actifs
2. Vider le cache du navigateur (Ctrl+Shift+R)
3. Vérifier la console pour les erreurs
4. Consulter INTERFACE_CAISSE.md pour plus de détails
