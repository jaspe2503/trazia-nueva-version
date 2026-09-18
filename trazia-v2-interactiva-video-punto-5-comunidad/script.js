/**
 * TRAZIA V2 — Interactividad, conversión B2B y navegación editorial
 * Mejora progresiva: todo funciona sin depender de frameworks.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollProgress();
    initActiveNavigation();
    initOriginCards();
    initJourney();
    initRegionExplorer();
    initAudienceLinks();
    initIntentSelector();
    initFormHandler();
    initEditorialObserver();
});

function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    const update = () => navbar.classList.toggle('is-scrolled', window.scrollY > 30);
    window.addEventListener('scroll', update, { passive: true });
    update();
}

function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    const close = () => {
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
        const open = !menu.classList.contains('active');
        menu.classList.toggle('active', open);
        toggle.setAttribute('aria-expanded', String(open));
    });

    menu.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', close));
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (event) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;
            event.preventDefault();
            const navbar = document.getElementById('navbar');
            const offset = (navbar?.offsetHeight || 80) + 10;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        });
    });
}

function initScrollProgress() {
    const bar = document.querySelector('#scrollProgress span');
    if (!bar) return;
    const update = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
        bar.style.width = `${ratio * 100}%`;
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
}

function initActiveNavigation() {
    const links = [...document.querySelectorAll('.nav-link[href^="#"]')];
    const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    if (!links.length || !sections.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            links.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
        });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
}

function initOriginCards() {
    document.querySelectorAll('.interactive-card').forEach(card => {
        const button = card.querySelector('.card-hit-area');
        const detail = card.querySelector('.card-detail');
        if (!button || !detail) return;
        button.addEventListener('click', () => {
            const open = card.classList.toggle('is-open');
            button.setAttribute('aria-expanded', String(open));
            detail.hidden = !open;
        });
    });
}

const journeyData = {
    productores: { kicker: '01 · ORIGEN', copy: 'La historia comienza con las personas que conocen la tierra, toman decisiones en la finca y hacen posible cada cosecha.', image: 'images/rostro_productor.jpg', alt: 'Productor de café trabajando en la finca' },
    territorio: { kicker: '02 · ORIGEN', copy: 'Altitud, suelo, sombra y microclima ayudan a comprender el contexto en el que nace cada café.', image: 'images/rostro_montana.jpg', alt: 'Paisaje montañoso de una zona cafetalera' },
    cosecha: { kicker: '03 · PROCESO', copy: 'La recolección selectiva y el beneficio cuidadoso marcan una etapa decisiva del recorrido.', image: 'images/rostro_cerezas.jpg', alt: 'Cerezas de café en diferentes niveles de madurez' },
    informacion: { kicker: '04 · TRAZABILIDAD', copy: 'Los datos de origen, proceso y variedad permiten comunicar la historia del café con mayor claridad.', image: 'images/service_2.png', alt: 'Proceso de trabajo y documentación del café' },
    tostadores: { kicker: '05 · CONEXIÓN', copy: 'El diálogo profesional ayuda a valorar el perfil del café y a explorar relaciones comerciales de largo plazo.', mediaType: 'video', media: 'images/tostador_catacion.mp4', poster: '', alt: 'Video de evaluación sensorial de café en una sesión de catación' },
    mercados: { kicker: '06 · MERCADO', copy: 'La conexión con mercados especializados busca llevar el origen a nuevos espacios sin perder su identidad.', image: 'images/venezuela_tradicion.jpg', alt: 'Paisaje y tradición cafetalera de Venezuela' }
};

function initJourney() {
    const detail = document.getElementById('journeyDetail');
    const steps = [...document.querySelectorAll('.journey-step[data-journey]')];
    if (!detail || !steps.length) return;

    const select = step => {
        const key = step.dataset.journey;
        const data = journeyData[key];
        if (!data) return;
        steps.forEach(item => {
            const active = item === step;
            item.classList.toggle('is-active', active);
            item.setAttribute('aria-selected', String(active));
        });
        const kicker = detail.querySelector('.journey-detail-kicker');
        const copy = detail.querySelector('p');
        const media = detail.querySelector('.journey-detail-media');
        if (kicker) kicker.textContent = data.kicker;
        if (copy) copy.textContent = data.copy;
        if (media) {
            media.replaceChildren();
            if (data.mediaType === 'video') {
                const video = document.createElement('video');
                video.id = 'journeyDetailVideo';
                video.className = 'journey-detail-video';
                video.controls = true;
                video.preload = 'metadata';
                video.playsInline = true;
                video.setAttribute('aria-label', data.alt);
                if (data.poster) video.poster = data.poster;

                const source = document.createElement('source');
                source.src = data.media;
                source.type = 'video/mp4';
                video.appendChild(source);
                video.appendChild(document.createTextNode('Tu navegador no puede reproducir este video.'));
                media.appendChild(video);
            } else {
                const image = document.createElement('img');
                image.id = 'journeyDetailImage';
                image.className = 'journey-detail-image';
                image.src = data.media || data.image;
                image.alt = data.alt;
                image.loading = 'lazy';
                media.appendChild(image);
            }
        }
    };

    steps.forEach(step => step.addEventListener('click', () => select(step)));
}

function initRegionExplorer() {
    const tabs = [...document.querySelectorAll('.region-tab[data-region]')];
    const panels = [...document.querySelectorAll('.region-panel[data-region-panel]')];
    if (!tabs.length || !panels.length) return;

    tabs.forEach(tab => tab.addEventListener('click', () => {
        const region = tab.dataset.region;
        tabs.forEach(item => {
            const active = item === tab;
            item.classList.toggle('is-active', active);
            item.setAttribute('aria-selected', String(active));
        });
        panels.forEach(panel => {
            const active = panel.dataset.regionPanel === region;
            panel.hidden = !active;
            panel.classList.toggle('is-active', active);
        });
    }));
}

function initAudienceLinks() {
    document.querySelectorAll('[data-intent]').forEach(link => {
        link.addEventListener('click', () => {
            const intent = link.dataset.intent;
            if (!intent) return;
            selectIntentByRole(intent);
            if (link.tagName === 'BUTTON') {
                window.setTimeout(() => {
                    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 80);
            }
        });
    });
}

function selectIntentByRole(role) {
    const input = document.querySelector(`.intent-option input[data-role="${CSS.escape(role)}"]`);
    if (!input) return;
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
}

function initIntentSelector() {
    const inputs = [...document.querySelectorAll('.intent-option input[name="interes_principal"]')];
    const context = document.getElementById('formContext');
    const title = document.getElementById('formContextTitle');
    const text = document.getElementById('formContextText');
    if (!inputs.length) return;

    const copy = {
        productor: ['Presenta tu origen', 'Cuéntanos sobre tu finca, territorio, proceso y el café que quieres dar a conocer.'],
        tostador: ['Cuéntanos qué buscas', 'Puedes indicarnos el origen, formato o tipo de relación que te interesa explorar.'],
        importador: ['Hablemos de abastecimiento', 'Indícanos el mercado, volumen aproximado o necesidades que quieres conversar.'],
        profesional: ['Exploremos una alianza', 'Cuéntanos qué tipo de colaboración o conexión te gustaría desarrollar.']
    };

    const update = input => {
        if (!context || !title || !text) return;
        const role = input?.dataset.role;
        const data = copy[role] || ['Cuéntanos un poco más', 'Tu información nos ayudará a entender mejor cómo iniciar la conversación.'];
        title.textContent = data[0];
        text.textContent = data[1];
        context.hidden = false;
    };

    inputs.forEach(input => input.addEventListener('change', () => update(input)));
}

function initFormHandler() {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');
    if (!form || !feedback) return;

    form.addEventListener('submit', async event => {
        if (form.dataset.nativeSubmit === 'true') return;
        event.preventDefault();
        const submit = form.querySelector('.btn-submit');
        const label = submit?.querySelector('.submit-label');
        if (submit) submit.disabled = true;
        if (label) label.textContent = 'Enviando...';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });
            if (!response.ok) throw new Error('Formspree returned an error');
            form.hidden = true;
            feedback.classList.remove('hidden');
            feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (error) {
            // Fallback: submit natively if the enhanced request is blocked.
            if (submit) submit.disabled = false;
            if (label) label.textContent = 'Iniciar conversación';
            form.dataset.nativeSubmit = 'true';
            form.submit();
        }
    });
}

function initEditorialObserver() {
    const items = document.querySelectorAll('.rostro-card, .enfoque-card, .b2b-card, .dual-card, .journey-step, .region-panel, .pre-contact-inner');
    if (!items.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.08 });

    items.forEach(item => observer.observe(item));
}
