// ====== ANIMACIONES DINÁMICAS ======

document.addEventListener('DOMContentLoaded', () => {
    
    // ====== ANIMACIÓN DE SCROLL SUAVE PARA CARDS ======
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar todas las tarjetas de productos
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });

    // ====== EFECTO PARALLAX EN HERO ======
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            hero.style.opacity = 1 - (scrolled * 0.002);
        });
    }

    // ====== ANIMACIÓN PARA EL HEADER AL HACER SCROLL ======
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.8)';
        } else {
            header.style.padding = '20px 0';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        }

        lastScroll = currentScroll;
    });

    // ====== EFECTO RIPPLE EN BOTONES ======
    const buttons = document.querySelectorAll('button, .btn-login');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Estilos para el efecto ripple
    const style = document.createElement('style');
    style.textContent = `
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }

        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ====== LOADING SKELETON PARA PRODUCTOS ======
    const contenedor = document.getElementById('contenedor');
    if (contenedor && contenedor.children.length === 0) {
        // Mostrar skeleton mientras carga
        for (let i = 0; i < 6; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'card skeleton';
            skeleton.innerHTML = `
                <div class="skeleton-img"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line short"></div>
            `;
            contenedor.appendChild(skeleton);
        }

        // Agregar estilos para skeleton
        const skeletonStyle = document.createElement('style');
        skeletonStyle.textContent = `
            .skeleton {
                pointer-events: none;
            }

            .skeleton-img {
                width: 100%;
                height: 220px;
                background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
                background-size: 200% 100%;
                animation: skeleton-loading 1.5s infinite;
                border-radius: 15px;
                margin-bottom: 20px;
            }

            .skeleton-line {
                height: 20px;
                background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
                background-size: 200% 100%;
                animation: skeleton-loading 1.5s infinite;
                border-radius: 4px;
                margin-bottom: 10px;
            }

            .skeleton-line.short {
                width: 60%;
                margin: 0 auto;
            }

            @keyframes skeleton-loading {
                0% {
                    background-position: 200% 0;
                }
                100% {
                    background-position: -200% 0;
                }
            }
        `;
        document.head.appendChild(skeletonStyle);
    }

    // ====== ANIMACIÓN DE CONTADOR PARA NÚMEROS ======
    const animateNumbers = () => {
        const numbers = document.querySelectorAll('.precio');
        
        numbers.forEach(number => {
            const value = parseFloat(number.textContent.replace('$', '').replace(',', ''));
            if (!isNaN(value)) {
                let current = 0;
                const increment = value / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= value) {
                        number.textContent = '$' + value.toFixed(2);
                        clearInterval(timer);
                    } else {
                        number.textContent = '$' + current.toFixed(2);
                    }
                }, 20);
            }
        });
    };

    // Ejecutar animación de números cuando las tarjetas sean visibles
    setTimeout(() => {
        const priceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    priceObserver.disconnect();
                }
            });
        });

        const firstCard = document.querySelector('.card');
        if (firstCard) {
            priceObserver.observe(firstCard);
        }
    }, 500);

    // ====== HOVER 3D EFFECT EN CARDS ======
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ====== SMOOTH SCROLL PARA ENLACES INTERNOS ======
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    console.log('🎨 Animaciones cargadas correctamente');
});
