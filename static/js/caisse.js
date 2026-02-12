// Cart state
let cart = [];
let nextItemId = 1;

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    setupEventListeners();
    setupKeyboardShortcuts();
    updateCart();
});

// Event Listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const modalSearchInput = document.getElementById('modalSearchInput');

    // Main search input
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            searchArticleByBarcode(this.value);
            this.value = '';
        }
    });

    // Modal search input
    modalSearchInput.addEventListener('input', debounce(function () {
        searchArticles(this.value);
    }, 300));
}

// --- GESTION DES RACCOURCIS CLAVIER ---
/**
 * Configure les touches Rapides pour améliorer la productivité du caissier.
 * F1: Recherche rapide | F5: Passer au paiement | ESC: Annuler/Fermer
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
        // F1 - Ouvre la recherche d'articles
        if (e.key === 'F1') {
            e.preventDefault();
            openSearchModal();
        }
        // F5 - Ouvre la fenêtre de paiement si le panier n'est pas vide
        else if (e.key === 'F5') {
            e.preventDefault();
            if (cart.length > 0) {
                openPaymentModal();
            }
        }
        // ESC - Gestion de la fermeture des fenêtres ou vidage du panier
        else if (e.key === 'Escape') {
            if (!document.getElementById('searchModal').classList.contains('hidden')) {
                closeSearchModal();
            } else if (!document.getElementById('receiptModal').classList.contains('hidden')) {
                closeReceiptModal();
            } else if (cart.length > 0) {
                if (confirm('Vider le panier ?')) {
                    clearCart();
                }
            }
        }
    });
}

// --- COMMUNICATIONS AVEC LE SERVEUR (API) ---

/**
 * Récupère le jeton CSRF nécessaire pour sécuriser les requêtes POST vers Django.
 * Sans ce jeton, le serveur rejettera toute tentative d'enregistrement par sécurité.
 */
function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

/**
 * Recherche un article par son code-barres via l'API Django.
 * Utilisé lors d'un scan direct ou d'une saisie manuelle rapide.
 */
function searchArticleByBarcode(barcode) {
    if (!barcode) return;

    // Appel asynchrone au backend
    fetch(`/caisse/api/search/?q=${barcode}`)
        .then(response => response.json())
        .then(data => {
            if (data.articles && data.articles.length > 0) {
                // On prend le premier article correspondant trouvé en base de données
                const article = data.articles[0];
                addToCart(article);
            } else {
                alert('Article non trouvé dans la base de données');
            }
        })
        .catch(error => console.error('Erreur lors de la recherche:', error));
}

// Search articles (modal)
function searchArticles(query) {
    if (!query || query.length < 2) {
        document.getElementById('searchResults').innerHTML = '';
        return;
    }

    fetch(`/caisse/api/search/?q=${query}`)
        .then(response => response.json())
        .then(data => {
            displaySearchResults(data.articles);
        })
        .catch(error => console.error('Erreur:', error));
}

// Display search results
function displaySearchResults(articles) {
    const container = document.getElementById('searchResults');

    if (articles.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500 py-8">Aucun article trouvé</p>';
        return;
    }

    container.innerHTML = articles.map(article => `
        <div class="search-result-item p-4 border-b border-gray-200 hover:bg-gray-50" onclick='addToCartFromModal(${JSON.stringify(article)})'>
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">${article.nom}</h4>
                    <p class="text-sm text-gray-500">${article.code_barres}</p>
                </div>
                <div class="text-right">
                    <p class="font-bold text-lg text-gray-900">${article.prix_ttc.toFixed(2)} €</p>
                    <p class="text-sm text-gray-500">Stock: ${article.stock}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Add to cart from modal
function addToCartFromModal(article) {
    addToCart(article);
    closeSearchModal();
}

// Add item to cart
function addToCart(article) {
    const existingItem = cart.find(item => item.article_id === article.id);

    if (existingItem) {
        existingItem.quantite++;
        existingItem.total = existingItem.quantite * existingItem.prix_unitaire;
    } else {
        cart.push({
            id: nextItemId++,
            article_id: article.id,
            nom: article.nom,
            code_barres: article.code_barres,
            prix_unitaire: article.prix_ttc,
            prix_ht: article.prix_ht,
            quantite: 1,
            total: article.prix_ttc,
            tva_rate: 5.5
        });
    }

    updateCart();
}

// Update quantity
function updateQuantity(itemId, delta) {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;

    item.quantite += delta;

    if (item.quantite <= 0) {
        removeFromCart(itemId);
    } else {
        item.total = item.quantite * item.prix_unitaire;
        updateCart();
    }
}

// Remove from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

// Clear cart
function clearCart() {
    cart = [];
    updateCart();
}

// Update cart display
function updateCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartTitle = document.getElementById('cartTitle');
    const paymentBtn = document.getElementById('paymentBtn');

    // Calculate totals
    const totalItems = cart.reduce((sum, item) => sum + item.quantite, 0);
    const totalHT = cart.reduce((sum, item) => sum + (item.prix_ht * item.quantite), 0);
    const totalTTC = cart.reduce((sum, item) => sum + item.total, 0);
    const totalTVA = totalTTC - totalHT;

    // Update title
    cartTitle.textContent = `Panier (${totalItems} article${totalItems > 1 ? 's' : ''})`;

    // Update totals
    document.getElementById('totalHT').textContent = totalHT.toFixed(2) + ' €';
    document.getElementById('totalTVA').textContent = totalTVA.toFixed(2) + ' €';
    document.getElementById('totalTTC').textContent = totalTTC.toFixed(2) + ' €';
    document.getElementById('itemCount').textContent = totalItems;

    // Enable/disable payment button
    paymentBtn.disabled = cart.length === 0;

    // Show/hide empty state
    if (cart.length === 0) {
        emptyCart.classList.remove('hidden');
        const existingItems = cartItemsContainer.querySelectorAll('.cart-item');
        existingItems.forEach(item => item.remove());
    } else {
        emptyCart.classList.add('hidden');

        // Render cart items
        const existingItems = cartItemsContainer.querySelectorAll('.cart-item');
        existingItems.forEach(item => item.remove());

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item p-4';
            itemElement.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-900">${item.nom}</h4>
                        <p class="text-sm text-gray-500">${item.prix_unitaire.toFixed(2)} € • TVA ${item.tva_rate}%</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2">
                            <button onclick="updateQuantity(${item.id}, -1)" class="quantity-btn w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                                </svg>
                            </button>
                            <span class="w-12 text-center font-medium">${item.quantite}</span>
                            <button onclick="updateQuantity(${item.id}, 1)" class="quantity-btn w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                            </button>
                        </div>
                        <span class="font-bold text-lg w-24 text-right">${item.total.toFixed(2)} €</span>
                        <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }
}

// Modal functions
function openSearchModal() {
    document.getElementById('searchModal').classList.remove('hidden');
    document.getElementById('modalSearchInput').focus();
}

function closeSearchModal() {
    document.getElementById('searchModal').classList.add('hidden');
    document.getElementById('modalSearchInput').value = '';
    document.getElementById('searchResults').innerHTML = '';
}

function openPaymentModal() {
    if (cart.length === 0) return;

    // Generate receipt
    const receiptNumber = 'FAC-' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR') + ' ' + now.toLocaleTimeString('fr-FR');

    document.getElementById('receiptNumber').textContent = receiptNumber;
    document.getElementById('receiptDate').textContent = dateStr;

    // Calculate totals
    const totalHT = cart.reduce((sum, item) => sum + (item.prix_ht * item.quantite), 0);
    const totalTTC = cart.reduce((sum, item) => sum + item.total, 0);
    const totalTVA = totalTTC - totalHT;

    document.getElementById('receiptHT').textContent = totalHT.toFixed(2) + ' €';
    document.getElementById('receiptTVA').textContent = totalTVA.toFixed(2) + ' €';
    document.getElementById('receiptTTC').textContent = totalTTC.toFixed(2) + ' €';

    // Render items
    const receiptItems = document.getElementById('receiptItems');
    receiptItems.innerHTML = cart.map(item => `
        <div class="flex justify-between text-sm">
            <span>${item.nom} x${item.quantite}</span>
            <span class="font-medium">${item.total.toFixed(2)} €</span>
        </div>
    `).join('');

    document.getElementById('receiptModal').classList.remove('hidden');
}

function closeReceiptModal() {
    document.getElementById('receiptModal').classList.add('hidden');
}

function printReceipt() {
    window.print();
}

/**
 * ACTION FINALE : Enregistrement de la vente.
 * Envoie le contenu du panier au serveur pour créer une Facture officielle
 * et mettre à jour les stocks en base de données.
 */
function finishTransaction() {
    // Sécurité : ne rien faire si le panier est vide
    if (cart.length === 0) return;

    // Préparation des données pour le serveur
    const data = {
        items: cart.map(item => ({
            article_id: item.article_id,
            quantite: item.quantite,
            prix_unitaire: item.prix_unitaire,
            total: item.total
        }))
    };

    // Envoi de la requête POST au serveur Django
    fetch('/caisse/api/facture/create/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken() // Protection contre les attaques CSRF
        },
        body: JSON.stringify(data) // Conversion de l'objet JS en texte (JSON)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Si le serveur confirme l'enregistrement (Code 200)
                alert(`Transaction terminée avec succès !\nNuméro de Facture : ${data.numero_facture}`);
                clearCart();         // Vide le panier
                closeReceiptModal(); // Ferme la fenêtre
            } else {
                // Si le serveur renvoie une erreur (ex: rupture de stock)
                alert('Erreur serveur lors de la création de la facture : ' + data.error);
            }
        })
        .catch(error => {
            console.error('Erreur fatale:', error);
            alert('Impossible de contacter le serveur. Vérifiez votre connexion.');
        });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
