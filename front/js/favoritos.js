// Sistema de Favoritos
const API_URL = 'http://localhost:3000/api';

// Verificar si el usuario está logueado
function getLoggedUser() {
    const userEmail = localStorage.getItem('currentUserEmail');
    const userName = localStorage.getItem('currentUserName');
    
    if (!userEmail) return null;
    
    // Extraer ID del email (simple hash para demo - en producción usar ID real del backend)
    const userId = hashEmail(userEmail);
    
    return {
        id: userId,
        email: userEmail,
        name: userName
    };
}

// Función simple para generar un ID desde el email (para demo)
function hashEmail(email) {
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
        const char = email.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

// Agregar producto a favoritos
async function agregarFavorito(productoId) {
    const user = getLoggedUser();
    
    if (!user) {
        alert('Debes iniciar sesión para agregar favoritos');
        window.location.href = 'login.html';
        return false;
    }

    try {
        const response = await fetch(`${API_URL}/favoritos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user.id,
                producto_id: productoId
            })
        });

        const data = await response.json();
        
        if (data.ok) {
            return true;
        } else {
            console.warn(data.msg);
            return false;
        }
    } catch (error) {
        console.error('Error al agregar favorito:', error);
        return false;
    }
}

// Eliminar producto de favoritos
async function eliminarFavorito(productoId) {
    const user = getLoggedUser();
    
    if (!user) return false;

    try {
        const response = await fetch(`${API_URL}/favoritos/${user.id}/${productoId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        return data.ok;
    } catch (error) {
        console.error('Error al eliminar favorito:', error);
        return false;
    }
}

// Verificar si un producto está en favoritos
async function esFavorito(productoId) {
    const user = getLoggedUser();
    
    if (!user) return false;

    try {
        const response = await fetch(`${API_URL}/favoritos/check/${user.id}/${productoId}`);
        const data = await response.json();
        return data.isFavorite;
    } catch (error) {
        console.error('Error al verificar favorito:', error);
        return false;
    }
}

// Obtener todos los favoritos del usuario
async function obtenerFavoritos() {
    const user = getLoggedUser();
    
    if (!user) return [];

    try {
        const response = await fetch(`${API_URL}/favoritos/${user.id}`);
        const data = await response.json();
        return data.ok ? data.favoritos : [];
    } catch (error) {
        console.error('Error al obtener favoritos:', error);
        return [];
    }
}

// Toggle favorito (agregar o quitar)
async function toggleFavorito(productoId, heartIcon) {
    const isFav = await esFavorito(productoId);
    
    if (isFav) {
        const success = await eliminarFavorito(productoId);
        if (success) {
            heartIcon.classList.remove('active');
            heartIcon.innerHTML = '🤍';
            return false;
        }
    } else {
        const success = await agregarFavorito(productoId);
        if (success) {
            heartIcon.classList.add('active');
            heartIcon.innerHTML = '❤️';
            // Animación de "me gusta"
            heartIcon.style.animation = 'heartBeat 0.5s ease';
            setTimeout(() => {
                heartIcon.style.animation = '';
            }, 500);
            return true;
        }
    }
}

// Cargar favoritos en la página de favoritos
if (window.location.pathname.includes('favoritos.html')) {
    document.addEventListener('DOMContentLoaded', async () => {
        const user = getLoggedUser();
        const noLoginMessage = document.getElementById('no-login-message');
        const favoritosSection = document.getElementById('favoritos-section');
        
        if (!user) {
            noLoginMessage.style.display = 'block';
            favoritosSection.style.display = 'none';
            return;
        }

        noLoginMessage.style.display = 'none';
        favoritosSection.style.display = 'block';

        const favoritos = await obtenerFavoritos();
        const contenedor = document.getElementById('contenedor-favoritos');
        const emptyMessage = document.getElementById('empty-favorites');

        if (favoritos.length === 0) {
            emptyMessage.style.display = 'block';
            return;
        }

        emptyMessage.style.display = 'none';

        favoritos.forEach(producto => {
            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `
                <button class="favorite-btn active" data-producto-id="${producto.id}">❤️</button>
                <img src="img/${producto.imagen}" alt="${producto.nombre}"
                     onerror="this.src='https://via.placeholder.com/300x220/1a1a1a/ffffff?text=Sin+Imagen'">
                <h3>${producto.nombre}</h3>
                <p class="precio">$${producto.precio}</p>
                <p>Stock: ${producto.stock}</p>
            `;

            const favoriteBtn = div.querySelector('.favorite-btn');
            favoriteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const success = await eliminarFavorito(producto.id);
                if (success) {
                    div.style.animation = 'fadeOut 0.5s ease';
                    setTimeout(() => {
                        div.remove();
                        // Verificar si quedan favoritos
                        if (contenedor.children.length === 0) {
                            emptyMessage.style.display = 'block';
                        }
                    }, 500);
                }
            });

            contenedor.appendChild(div);
        });
    });
}

console.log('🎯 Sistema de favoritos cargado');
