// ========================================
// CARRUSEL DE PRODUCTOS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('contenedor');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');
  
  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;
  
  let currentPosition = 0;
  let cardsPerView = getCardsPerView();
  let totalCards = 0;
  let maxPosition = 0;
  
  // Función para calcular cuántas cards se ven según el ancho de pantalla
  function getCardsPerView() {
    const width = window.innerWidth;
    if (width >= 1400) return 4;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
  }
  
  // Función para actualizar el carrusel
  function updateCarousel() {
    const cards = track.querySelectorAll('.card');
    totalCards = cards.length;
    
    if (totalCards === 0) return;
    
    maxPosition = Math.max(0, totalCards - cardsPerView);
    
    // Ajustar posición si excede el máximo
    if (currentPosition > maxPosition) {
      currentPosition = maxPosition;
    }
    
    // Calcular desplazamiento
    const cardWidth = cards[0].offsetWidth;
    const gap = 30;
    const offset = -(currentPosition * (cardWidth + gap));
    
    track.style.transform = `translateX(${offset}px)`;
    
    // Actualizar botones
    prevBtn.disabled = currentPosition === 0;
    nextBtn.disabled = currentPosition >= maxPosition;
    
    // Actualizar dots
    updateDots();
  }
  
  // Función para crear dots
  function createDots() {
    dotsContainer.innerHTML = '';
    
    const totalDots = Math.ceil(totalCards / cardsPerView);
    
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('data-index', i);
      
      dot.addEventListener('click', () => {
        currentPosition = i * cardsPerView;
        if (currentPosition > maxPosition) {
          currentPosition = maxPosition;
        }
        updateCarousel();
      });
      
      dotsContainer.appendChild(dot);
    }
  }
  
  // Función para actualizar dots activos
  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    const currentDot = Math.floor(currentPosition / cardsPerView);
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentDot);
    });
  }
  
  // Botón anterior
  prevBtn.addEventListener('click', () => {
    if (currentPosition > 0) {
      currentPosition -= cardsPerView;
      if (currentPosition < 0) currentPosition = 0;
      updateCarousel();
    }
  });
  
  // Botón siguiente
  nextBtn.addEventListener('click', () => {
    if (currentPosition < maxPosition) {
      currentPosition += cardsPerView;
      if (currentPosition > maxPosition) currentPosition = maxPosition;
      updateCarousel();
    }
  });
  
  // Navegación con teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevBtn.click();
    } else if (e.key === 'ArrowRight') {
      nextBtn.click();
    }
  });
  
  // Observar cambios en el contenedor (cuando se cargan productos)
  const observer = new MutationObserver(() => {
    const cards = track.querySelectorAll('.card');
    if (cards.length > 0) {
      totalCards = cards.length;
      maxPosition = Math.max(0, totalCards - cardsPerView);
      createDots();
      updateCarousel();
    }
  });
  
  observer.observe(track, { childList: true, subtree: true });
  
  // Actualizar en resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cardsPerView = getCardsPerView();
      maxPosition = Math.max(0, totalCards - cardsPerView);
      
      // Ajustar posición actual si es necesario
      if (currentPosition > maxPosition) {
        currentPosition = maxPosition;
      }
      
      createDots();
      updateCarousel();
    }, 250);
  });
  
  // Touch/Swipe support para móviles
  let touchStartX = 0;
  let touchEndX = 0;
  
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - siguiente
        nextBtn.click();
      } else {
        // Swipe right - anterior
        prevBtn.click();
      }
    }
  }
  
  // Inicializar cuando ya hay productos cargados
  setTimeout(() => {
    const cards = track.querySelectorAll('.card');
    if (cards.length > 0) {
      totalCards = cards.length;
      maxPosition = Math.max(0, totalCards - cardsPerView);
      createDots();
      updateCarousel();
    }
  }, 500);
});
