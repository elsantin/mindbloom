// COMENTARIO_ESTRATÉGICO: Envolvemos TODO el código en este listener.
// Se asegura de que ningún código intente manipular un elemento del DOM
// antes de que esté completamente cargado y listo en la página.
document.addEventListener('DOMContentLoaded', () => {

    // --- Funcionalidad de Pantalla de Carga ---
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.classList.add('fade-out');
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 500); // Coincide con la duración de la transición en CSS
        }, 500); // Un pequeño retraso para mostrar la animación si la carga es muy rápida
    }

    // --- Gestión del Tema (Claro/Oscuro) ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null; // Para cambiar el icono

    // Función para aplicar el tema y actualizar el icono
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeIcon) {
            if (theme === 'light') {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
    }

    // Aplica el tema guardado o el preferido por el sistema al cargar la página
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
        currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
            showToast(newTheme === 'light' ? '☀️ Modo claro activado' : '🌙 Modo oscuro activado');
        });
    }
    

    // --- Menú Móvil y Accesibilidad (Focus Trap) ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMobileMenuButton = document.getElementById('close-mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const body = document.body;

    function openMenu() {
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.setAttribute('aria-expanded', 'true');
            body.classList.add('overflow-hidden'); 
            mobileMenu.classList.remove('-translate-x-full');
            mobileMenu.classList.add('translate-x-0'); // Asegura que se muestre
            // trapFocus(mobileMenu); // Se llama después de que el menú es visible
            setTimeout(() => { // Dar foco al primer elemento enfocable del menú
                const firstFocusableElement = mobileMenu.querySelector('a[href], button:not([disabled])');
                if (firstFocusableElement) firstFocusableElement.focus();
            }, 300); // Pequeño delay para asegurar que la transición haya comenzado
        }
    }

    function closeMenu() {
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            body.classList.remove('overflow-hidden');
            mobileMenu.classList.add('-translate-x-full');
            mobileMenu.classList.remove('translate-x-0');
            mobileMenuButton.focus(); // Devolver el foco al botón que abrió el menú
        }
    }
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', openMenu);
    }
    if (closeMobileMenuButton) {
        closeMobileMenuButton.addEventListener('click', closeMenu);
    }
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMenu); // Cerrar al hacer clic en el overlay
    }

    // Cerrar menú al hacer clic en un enlace dentro del menú
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a.mobile-nav-link').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
    
    // Cerrar menú con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenuButton.getAttribute('aria-expanded') === 'true') {
            closeMenu();
        }
    });

    // --- Check-in Emocional Interactivo ---
    const emotionalCheckin = document.getElementById('emotional-checkin');
    const responseMessage = document.getElementById('checkin-response');
    
    if (emotionalCheckin && responseMessage) {
        const moodButtons = emotionalCheckin.querySelectorAll('.mood-button');
        moodButtons.forEach(button => {
            button.addEventListener('click', () => {
                const mood = button.getAttribute('data-mood');
                responseMessage.textContent = `Entendido. Está bien sentirse ${mood}. Recuerda respirar.`;
                responseMessage.classList.remove('hidden');

                moodButtons.forEach(btn => btn.classList.remove('ring-accent')); // Usar la clase personalizada
                button.classList.add('ring-accent'); // Usar la clase personalizada
            });
        });
    }

    // --- Animaciones de Scroll para Secciones ---
    const sections = document.querySelectorAll('.section-animation');
    if (sections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target); 
                }
            });
        }, {
            threshold: 0.15 // Un poco más de visibilidad antes de animar
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // --- Notificaciones Toast ---
    function showToast(message) {
        const toast = document.getElementById('toast-notification');
        const toastMessage = document.getElementById('toast-message');

        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.remove('hidden', 'opacity-0');
            toast.classList.add('opacity-100');

            setTimeout(() => {
                toast.classList.remove('opacity-100');
                toast.classList.add('opacity-0');
                setTimeout(() => {
                    toast.classList.add('hidden');
                }, 300); // Coincide con la duración de la transición de opacidad
            }, 3000); // El toast es visible por 3 segundos
        }
    }

    // --- Funcionalidad del Botón Volver Arriba ---
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) { // Mostrar el botón después de 300px de scroll
                scrollToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                scrollToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
            } else {
                scrollToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
                scrollToTopBtn.classList.add('opacity-0', 'pointer-events-none');
            }
        }, { passive: true }); // Mejora de rendimiento para el scroll listener

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Scroll suave
            });
        });
    }

    // --- Actualizar enlace activo en la navegación al hacer scroll ---
    const navLinks = document.querySelectorAll('nav a.nav-link');
    const allSections = document.querySelectorAll('main section[id]'); // Solo secciones con ID en main

    function updateActiveNavLink() {
        let currentSectionId = '';
        allSections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Ajustar el offset para que la sección se active un poco antes de llegar exactamente a su tope
            // El alto del header es aproximadamente 50px (0.25rem + 0.25rem padding + contenido)
            const headerOffset = 70; // Un poco más que el alto del header
            if (window.pageYOffset >= sectionTop - headerOffset) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Asegurarse de que el href exista y no sea solo "#"
            if (link.getAttribute('href') && link.getAttribute('href').substring(1) === currentSectionId) {
                link.classList.add('active');
            }
        });
        // Si no hay sección activa (estamos al inicio, antes de la primera sección con ID)
        // o si el scroll está muy arriba, activar "Inicio"
        if (!currentSectionId && window.pageYOffset < (allSections[0] ? allSections[0].offsetTop - headerOffset : 500) ) {
             const homeLink = document.querySelector('nav a.nav-link[href="#hero"]');
             if(homeLink) homeLink.classList.add('active');
        }
    }
    
    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
    updateActiveNavLink(); // Llamar una vez al cargar para el estado inicial

}); // Fin de DOMContentLoaded
