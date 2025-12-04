// ============================================
// FUNCIONES PARA WISHLIST (FAVORITOS)
// ============================================

// API_BASE ya está declarada en auth.js y expuesta como window.API_BASE

// Obtener ID del usuario actual
function getUserId() {
    return localStorage.getItem('currentUserId');
}

// Verificar si el usuario está logueado
function isLoggedIn() {
    return !!getUserId();
}

// Actualizar contador de favoritos en el navbar
function actualizarContadorFavoritos() {
    const userId = getUserId();
    if (!userId) {
        const badge = document.getElementById('favoritos-count-nav');
        if (badge) badge.style.display = 'none';
        return;
    }

    fetch(`${window.API_BASE}/wishlist/${userId}/count`)
        .then(res => res.json())
        .then(data => {
            const badge = document.getElementById('favoritos-count-nav');
            if (badge) {
                if (data.count > 0) {
                    badge.textContent = data.count;
                    badge.style.display = 'flex';
                } else {
                    badge.style.display = 'none';
                }
            }
        })
        .catch(err => console.error('Error al actualizar contador:', err));
}

// Agregar producto a favoritos
function agregarAFavoritos(productId) {
    const userId = getUserId();
    
    console.log('agregarAFavoritos llamado:', { productId, userId });
    
    if (!userId) {
        console.warn('No hay userId, mostrando alerta');
        Swal.fire({
            icon: 'info',
            title: 'Inicia sesión',
            text: 'Debes iniciar sesión para agregar favoritos'
        });
        return Promise.reject('No logged in');
    }

    console.log('Enviando POST a:', `${window.API_BASE}/wishlist`, { id_usuario: userId, id_producto: productId });

    return fetch(`${window.API_BASE}/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: userId, id_producto: productId })
    })
    .then(res => {
        console.log('Respuesta recibida:', res.status, res.statusText);
        if (res.status === 409) {
            return res.json().then(data => {
                Swal.fire({
                    icon: 'info',
                    title: 'Ya está en favoritos',
                    text: data.message,
                    timer: 2000,
                    showConfirmButton: false
                });
                throw new Error('Duplicate');
            });
        }
        if (!res.ok) throw new Error('Error al agregar');
        return res.json();
    })
    .then(data => {
        console.log('Producto agregado exitosamente:', data);
        Swal.fire({
            icon: 'success',
            title: 'Agregado',
            text: data.message,
            timer: 2000,
            showConfirmButton: false
        });
        actualizarContadorFavoritos();
        actualizarBotonFavorito(productId, true);
        return data;
    })
    .catch(err => {
        if (err.message !== 'Duplicate') {
            console.error('Error:', err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo agregar a favoritos'
            });
        }
        throw err;
    });
}

// Eliminar producto de favoritos
function eliminarDeFavoritos(productId) {
    const userId = getUserId();
    
    if (!userId) return Promise.reject('No logged in');

    return fetch(`${window.API_BASE}/wishlist/${userId}/${productId}`, {
        method: 'DELETE'
    })
    .then(res => {
        if (!res.ok) throw new Error('Error al eliminar');
        return res.json();
    })
    .then(data => {
        Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: data.message,
            timer: 2000,
            showConfirmButton: false
        });
        actualizarContadorFavoritos();
        actualizarBotonFavorito(productId, false);
        return data;
    })
    .catch(err => {
        console.error('Error:', err);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar de favoritos'
        });
        throw err;
    });
}

// Verificar si un producto está en favoritos
function verificarEnFavoritos(productId) {
    const userId = getUserId();
    if (!userId) return Promise.resolve(false);

    return fetch(`${window.API_BASE}/wishlist/${userId}`)
        .then(res => res.json())
        .then(favoritos => {
            return favoritos.some(f => f.id_producto === productId);
        })
        .catch(err => {
            console.error('Error:', err);
            return false;
        });
}

// Actualizar el botón de favoritos en el modal
function actualizarBotonFavorito(productId, enFavoritos) {
    const btn = document.getElementById('modal-favorito-btn');
    if (!btn) {
        console.warn('Botón modal-favorito-btn no encontrado');
        return;
    }

    console.log('Actualizando botón favorito:', productId, enFavoritos);

    if (enFavoritos) {
        btn.textContent = 'En Favoritos';
        btn.classList.add('in-favoritos');
        btn.onclick = () => {
            console.log('Click eliminar de favoritos:', productId);
            eliminarDeFavoritos(productId);
        };
    } else {
        btn.textContent = 'Agregar a Favoritos';
        btn.classList.remove('in-favoritos');
        btn.onclick = () => {
            console.log('Click agregar a favoritos:', productId);
            agregarAFavoritos(productId);
        };
    }
}

// Cargar favoritos en la página favoritos.html
function cargarFavoritos() {
    const userId = getUserId();
    const loadingEl = document.getElementById('favoritos-loading');
    const emptyEl = document.getElementById('favoritos-empty');
    const gridEl = document.getElementById('favoritos-grid');

    if (!loadingEl || !emptyEl || !gridEl) return;

    // Verificar si está logueado
    if (!userId) {
        loadingEl.style.display = 'none';
        emptyEl.innerHTML = `
            <div class="favoritos-empty-icon">🔒</div>
            <h3>Debes iniciar sesión</h3>
            <p>Inicia sesión para ver tus favoritos</p>
            <a href="login.html" class="btn-explorar">Iniciar sesión</a>
        `;
        emptyEl.style.display = 'block';
        return;
    }

    loadingEl.style.display = 'block';
    emptyEl.style.display = 'none';
    gridEl.style.display = 'none';

    fetch(`${window.API_BASE}/wishlist/${userId}`)
        .then(res => res.json())
        .then(favoritos => {
            loadingEl.style.display = 'none';

            if (favoritos.length === 0) {
                emptyEl.style.display = 'block';
            } else {
                gridEl.style.display = 'grid';
                gridEl.innerHTML = '';

                favoritos.forEach(producto => {
                    const div = document.createElement('div');
                    div.className = 'card';
                    
                    // Verificar si está en oferta
                    const precioHtml = estaEnOferta(producto.id_producto) 
                        ? `<p class="precio-original">Antes: $${producto.precio}</p>
                           <p class="precio-oferta">$${calcularPrecioOferta(producto.precio, producto.id_producto)}</p>`
                        : `<p class="precio">$${producto.precio}</p>`;

                    div.innerHTML = `
                        <div class="card-image-wrapper" style="position: relative;">
                            <img src="http://localhost:3000/public/img/${producto.imagen}" alt="${producto.nombre}">
                            <button class="btn-remove-favorito" title="Eliminar de favoritos">✕</button>
                        </div>
                        <div class="card-content">
                            <span class="card-category">SNEAKERCLON5G</span>
                            <h3>${producto.nombre}</h3>
                            ${precioHtml}
                            <span class="stock-badge">${producto.stock > 0 ? `Stock: ${producto.stock}` : 'Sin Stock'}</span>
                        </div>
                    `;

                    // Click en la tarjeta para ver modal
                    div.addEventListener('click', (e) => {
                        if (!e.target.classList.contains('btn-remove-favorito')) {
                            mostrarModal(producto);
                        }
                    });

                    // Botón eliminar
                    const btnEliminar = div.querySelector('.btn-remove-favorito');
                    btnEliminar.addEventListener('click', (e) => {
                        e.stopPropagation();
                        eliminarDeFavoritos(producto.id_producto).then(() => {
                            div.remove();
                            if (gridEl.children.length === 0) {
                                gridEl.style.display = 'none';
                                emptyEl.style.display = 'block';
                            }
                        });
                    });

                    gridEl.appendChild(div);
                });
            }
        })
        .catch(err => {
            console.error('Error al cargar favoritos:', err);
            loadingEl.style.display = 'none';
            emptyEl.innerHTML = `
                <div class="favoritos-empty-icon">⚠</div>
                <h3>Error al cargar favoritos</h3>
                <p>Hubo un problema al cargar tus favoritos</p>
                <button onclick="location.reload()" class="btn-explorar">Reintentar</button>
            `;
            emptyEl.style.display = 'block';
        });
}

// Mostrar/Ocultar botón de favoritos en el header según sesión
function toggleFavoritosNav() {
    const btn = document.getElementById('btn-favoritos-nav');
    if (!btn) return;

    if (isLoggedIn()) {
        btn.classList.add('visible');
        actualizarContadorFavoritos();
    } else {
        btn.classList.remove('visible');
    }
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    toggleFavoritosNav();
    
    // Actualizar cuando cambie la sesión
    const originalGuardarSesionJWT = window.guardarSesionJWT;
    if (originalGuardarSesionJWT) {
        window.guardarSesionJWT = function(...args) {
            originalGuardarSesionJWT.apply(this, args);
            toggleFavoritosNav();
        };
    }

    const originalLimpiarSesion = window.limpiarSesion;
    if (originalLimpiarSesion) {
        window.limpiarSesion = function(...args) {
            originalLimpiarSesion.apply(this, args);
            toggleFavoritosNav();
        };
    }
});
