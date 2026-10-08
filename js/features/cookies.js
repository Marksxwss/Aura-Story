/*
 * aura/js/features/cookies.js
 * Banner de consentimento LGPD.
 */

window.AURA = window.AURA || {};

window.AURA.cookies = {
    init() {
        try {
            if (!localStorage.getItem('aura_cookie_consent')) {
                this.renderBanner();
            }
        } catch (e) {
            console.error("AURA Cookies: Erro ao acessar localStorage", e);
            this.renderBanner(); // Mostra o banner se o localStorage falhar
        }
    },

    renderBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.className = 'fixed bottom-0 left-0 w-full bg-aura-forest text-aura-white p-6 z-[1000] translate-y-full transition-transform duration-700 ease-in-out';
        banner.innerHTML = `
            <div class="container flex flex-col md:flex-row justify-between items-center gap-6">
                <p class="text-xs font-light leading-relaxed max-w-2xl">
                    Utilizamos cookies para aprimorar sua experiência de navegação e personalizar a curadoria de design.
                    Ao continuar, você concorda com nossa <a href="${window.AURA.utils.url('html/privacidade.html')}" class="underline hover:text-aura-terracotta">Política de Privacidade</a>.
                </p>
                <button id="accept-cookies" class="btn btn-primary bg-aura-white text-aura-forest px-8 py-2 text-[10px] uppercase tracking-widest font-bold">
                    Aceitar
                </button>
            </div>
        `;
        document.body.appendChild(banner);

        // Trigger slide up
        setTimeout(() => banner.classList.remove('translate-y-full'), 1000);

        document.getElementById('accept-cookies').addEventListener('click', () => {
            try {
                localStorage.setItem('aura_cookie_consent', 'true');
            } catch (e) {
                console.error("AURA Cookies: Erro ao salvar consentimento", e);
            }
            banner.classList.add('translate-y-full');
            setTimeout(() => banner.remove(), 700);
        });
    }
};
