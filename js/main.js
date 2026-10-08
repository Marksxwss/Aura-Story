/*
 * aura/js/main.js
 * Ponto de entrada e orquestração do ecossistema AURA.
 */

window.AURA = window.AURA || {};

window.AURA.init = function() {
    // 1. Inicializa a Store (Estado Global)
    try {
        window.AURA.store.init();
    } catch (e) {
        console.error("AURA Core: Erro ao iniciar Store", e);
    }

    // 2. Injeta a estrutura global (Header, Footer, Drawer)
    try {
        window.AURA.layout.init();
    } catch (e) {
        console.error("AURA Core: Erro ao iniciar Layout", e);
    }

    // 3. Inicializa as Features
    const features = [
        { name: 'animations', init: () => window.AURA.animations.init() },
        { name: 'cart', init: () => window.AURA.cart.init() },
        { name: 'search', init: () => window.AURA.search.init() },
        { name: 'catalog', init: () => window.AURA.catalog.init() },
        { name: 'product', init: () => window.AURA.product.init() },
        { name: 'checkout', init: () => window.AURA.checkout.init() },
        { name: 'forms', init: () => window.AURA.forms.init() },
        { name: 'cookies', init: () => window.AURA.cookies.init() },
    ];

    features.forEach(feat => {
        try {
            feat.init();
        } catch (e) {
            console.error(`AURA Feature: Erro ao iniciar ${feat.name}`, e);
        }
    });

    // 4. Configurações de Página Específicas
    this.setupPageSpecifics();
};

window.AURA.setupPageSpecifics = function() {
    const path = window.location.pathname;
    const header = document.getElementById('main-header');

    // Exemplo de lógica para mudar o estilo do header conforme a página
    if (header && path.includes('checkout.html')) {
        header.style.display = 'none';
    }
};

// Disparo da inicialização
document.addEventListener('DOMContentLoaded', () => {
    window.AURA.init();
});
