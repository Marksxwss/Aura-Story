/*
 * aura/js/core/utils.js
 * Funções auxiliares, formatadores e helpers de segurança.
 */

window.AURA = window.AURA || {};

window.AURA.utils = {
    // Resolve caminhos relativos com base na localização da página
    url: (path) => {
        if (!path) return '/';
        const isSubfolder = window.location.pathname.includes('/html/');
        if (isSubfolder && !path.startsWith('../') && !path.startsWith('http')) {
            return '../' + path;
        }
        return path;
    },

    // Formata centavos para moeda BRL
    formatCurrency: (cents) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(cents / 100);
    },

    // Escapa HTML para evitar XSS
    escapeHTML: (str) => {
        if (!str) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return str.replace(/[&<>"']/g, (m) => map[m]);
    },

    // Debounce para buscas e inputs
    debounce: (func, wait = 300) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    // Gera slug para URLs
    slugify: (text) => {
        return text.toString().toLowerCase().trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\--+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }
};
