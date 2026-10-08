/*
 * aura/js/features/catalog.js
 * Lógica de filtragem, ordenação e renderização da loja.
 */

window.AURA = window.AURA || {};

window.AURA.catalog = {
    currentFilters: {
        category: 'all',
        sort: 'default',
        priceRange: 'all'
    },

    init() {
        console.log("AURA Catalog: Inicializando...");
        try {
            if (document.getElementById('product-grid')) {
                this.bindEvents();
                this.render();
            } else {
                console.warn("AURA Catalog: Elemento #product-grid não encontrado na página.");
            }
        } catch (error) {
            console.error("AURA Catalog: Erro durante a inicialização:", error);
        }
    },

    bindEvents() {
        // Category filters
        document.querySelectorAll('.filter-cat-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cat = e.target.dataset.category;
                this.setFilter('category', cat);
            });
        });

        // Price Range filters
        document.querySelectorAll('.filter-price-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const range = e.target.dataset.range;
                this.setFilter('priceRange', range);
            });
        });

        // Sort dropdown
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.setFilter('sort', e.target.value);
            });
        }
    },

    setFilter(key, value) {
        console.log(`AURA Catalog: Filtro ${key} alterado para ${value}`);
        this.currentFilters[key] = value;
        this.updateURL();
        this.render();
    },

    updateURL() {
        const params = new URLSearchParams();
        if (this.currentFilters.category !== 'all') params.set('category', this.currentFilters.category);
        if (this.currentFilters.sort !== 'default') params.set('sort', this.currentFilters.sort);
        if (this.currentFilters.priceRange !== 'all') params.set('price', this.currentFilters.priceRange);

        const newURL = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({}, '', newURL);
    },

    getFilteredProducts() {
        try {
            if (!window.AURA_DATA || !window.AURA_DATA.products) {
                throw new Error("Dados de produtos (AURA_DATA.products) não carregados.");
            }

            let products = [...window.AURA_DATA.products];

            // Category Filter
            if (this.currentFilters.category !== 'all') {
                products = products.filter(p => p.categoria === this.currentFilters.category);
            }

            // Price Range Filter
            if (this.currentFilters.priceRange !== 'all') {
                products = products.filter(p => {
                    const preco = p.precoCentavos;
                    if (this.currentFilters.priceRange === 'low') return preco <= 50000;
                    if (this.currentFilters.priceRange === 'mid') return preco > 50000 && preco <= 200000;
                    if (this.currentFilters.priceRange === 'high') return preco > 200000;
                    return true;
                });
            }

            // Sorting
            switch (this.currentFilters.sort) {
                case 'price-asc':
                    products.sort((a, b) => a.precoCentavos - b.precoCentavos);
                    break;
                case 'price-desc':
                    products.sort((a, b) => b.precoCentavos - a.precoCentavos);
                    break;
                case 'newest':
                    products.sort((a, b) => b.id - a.id);
                    break;
            }

            return products;
        } catch (error) {
            console.error("AURA Catalog: Erro ao filtrar produtos:", error);
            return [];
        }
    },

    render() {
        const grid = document.getElementById('product-grid');
        if (!grid) return;

        const filtered = this.getFilteredProducts();

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-20">
                    <p class="text-aura-text-muted font-light text-lg">Nenhuma peça encontrada com esses filtros.</p>
                    <button onclick="location.reload()" class="mt-6 btn btn-outline text-[10px]">Limpar Filtros</button>
                </div>
            `;
            return;
        }

        try {
            grid.innerHTML = filtered.map(product => `
                <div class="product-card group reveal">
                    <div class="img-wrapper aspect-[3/4] bg-aura-stone overflow-hidden">
                        <img src="${product.imagens[0]}" alt="${product.nome}" loading="lazy" decoding="async">
                        <button onclick="window.AURA.cart.addToCart(${product.id})" class="quick-add">
                            Adicionar ao Carrinho
                        </button>
                    </div>
                    <div class="product-info">
                        <div class="max-w-[70%]">
                            <h3 class="product-name">${window.AURA.utils.escapeHTML(product.nome)}</h3>
                            <p class="product-meta">${product.categoria}</p>
                        </div>
                        <span class="product-price">${window.AURA.utils.formatCurrency(product.precoCentavos)}</span>
                    </div>
                </div>
            `).join('');

            if (window.AURA.animations && window.AURA.animations.initScrollReveal) {
                window.AURA.animations.initScrollReveal();
            }
        } catch (error) {
            console.error("AURA Catalog: Erro ao renderizar grade:", error);
            grid.innerHTML = `
                <div class="col-span-full text-center py-20">
                    <p class="text-red-500 font-light">Erro ao carregar produtos. Tente atualizar a página.</p>
                </div>
            `;
        }
    }
};
