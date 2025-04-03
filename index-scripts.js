document.addEventListener('DOMContentLoaded', function() {
    // Detectar elementos cuando entran en el viewport para animaciones
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-viewport');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar todos los elementos con clase .animate-on-scroll
    document.querySelectorAll('.card, .feature-item, .testimonial-card, .section-title').forEach(item => {
        item.classList.add('animate-on-scroll');
        observer.observe(item);
    });

    // Agregar efecto de parallax al hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            heroSection.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        });
    }

    // Efecto de hover para las cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const img = this.querySelector('.card-img-top');
            if (img) {
                img.style.transform = 'scale(1.05)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const img = this.querySelector('.card-img-top');
            if (img) {
                img.style.transform = 'scale(1)';
            }
        });
    });

    // Contador para estadísticas (si existen)
    if (document.querySelector('.counter')) {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // ms
            const increment = target / (duration / 16); // 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }

    // Función para cargar imágenes del carrusel 
    function loadMainCarouselImages() {
        const carouselInner = document.querySelector('#mainCarousel .carousel-inner');
        const carouselImages = document.querySelector('.carousel-images');
        
        if (!carouselInner || !carouselImages) return;
        
        // Primero cargamos las imágenes en el contenedor oculto
        fetch('/imagenes')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener las imágenes');
                }
                return response.json();
            })
            .then(images => {
                if (images.length === 0) {
                    console.warn('No hay imágenes disponibles');
                    return;
                }
                
                // Limpiar el carrusel
                carouselInner.innerHTML = '';
                
                // Agregar cada imagen al carrusel
                images.forEach((image, index) => {
                    const imagePath = `/imagenes/${image}`;
                    
                    const carouselItem = document.createElement('div');
                    carouselItem.className = index === 0 ? 'carousel-item active' : 'carousel-item';
                    
                    const img = document.createElement('img');
                    img.src = imagePath;
                    img.className = 'd-block w-100';
                    img.alt = `Slide ${index + 1}`;
                    img.style.height = '400px';
                    img.style.objectFit = 'cover';
                    
                    carouselItem.appendChild(img);
                    carouselInner.appendChild(carouselItem);
                });
            })
            .catch(error => {
                console.error('Error cargando imágenes del carrusel:', error);
                carouselInner.innerHTML = '<div class="carousel-item active">' +
                    '<div class="d-flex align-items-center justify-content-center bg-secondary" style="height: 400px;">' +
                    '<p class="text-white">No se pudieron cargar las imágenes</p>' +
                    '</div></div>';
            });
    }
    
    // Función para cargar los videos de testimonios
    function loadVideoTestimonials() {
        const videoTestimonialsContainer = document.getElementById('video-testimonials');
        if (!videoTestimonialsContainer) return;
        
        // Agregar indicador de carga
        videoTestimonialsContainer.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div><p class="mt-2">Cargando testimonios en video...</p></div>';
        
        // Variable para contar los videos totales añadidos
        let totalVideosAdded = 0;
        
        // Función para cargar videos locales
        const loadLocalVideos = () => {
            // Usamos la ruta original que funcionaba antes: videos/testimonios
            return fetch('/videos/testimonios')
                .then(response => {
                    if (!response.ok) {
                        console.warn('Error al acceder a /videos/testimonios:', response.status);
                        return [];
                    }
                    return response.json();
                })
                .then(videos => {
                    if (!videos || videos.length === 0) {
                        console.warn('No hay videos locales disponibles');
                        return [];
                    }
                    
                    console.log('Videos locales encontrados:', videos.length);
                    
                    // Filtrar solo archivos de video válidos
                    const validVideos = Array.isArray(videos) ? videos.filter(video => {
                        if (typeof video !== 'string') return false;
                        const extension = video.split('.').pop().toLowerCase();
                        return ['mp4', 'webm', 'ogg', 'mov'].includes(extension);
                    }) : [];
                    
                    // Procesar cada video encontrado
                    validVideos.forEach(video => {
                        // Construir la ruta del video
                        const videoPath = `/videos/testimonios/${video}`;
                        
                        // Crear el elemento de columna
                        const videoCol = document.createElement('div');
                        videoCol.className = 'col-md-6 col-lg-4 mb-4';
                        
                        // Crear un contenedor para el video con sombra y efectos
                        const videoContainer = document.createElement('div');
                        videoContainer.className = 'video-container shadow rounded overflow-hidden';
                        videoContainer.style.position = 'relative';
                        
                        // Crear el elemento de video
                        const videoElement = document.createElement('video');
                        videoElement.src = videoPath;
                        videoElement.controls = true;
                        videoElement.className = 'w-100';
                        videoElement.style.objectFit = 'cover';
                        videoElement.style.maxHeight = '250px';
                        
                        // Manejar el error de carga del video específicamente
                        videoElement.onerror = function() {
                            videoContainer.innerHTML = `
                                <div class="p-4 text-center">
                                    <i class="fas fa-exclamation-triangle text-warning mb-2" style="font-size: 2rem;"></i>
                                    <p class="mb-0">No se pudo cargar el video "${video}"</p>
                                </div>
                            `;
                        };
                        
                        // Agregar un título al video
                        const videoTitle = document.createElement('div');
                        videoTitle.className = 'video-title bg-light p-2 text-center';
                        videoTitle.textContent = video.split('.')[0].replace(/_/g, ' '); // Formatear nombre del archivo como título
                        
                        // Ensamblar los elementos
                        videoContainer.appendChild(videoElement);
                        videoContainer.appendChild(videoTitle);
                        videoCol.appendChild(videoContainer);
                        videoTestimonialsContainer.appendChild(videoCol);
                        totalVideosAdded++;
                    });
                    
                    return validVideos;
                })
                .catch(error => {
                    console.error('Error cargando videos locales:', error);
                    return [];
                });
        };
        
        // Función para cargar videos de YouTube (mantenemos la funcionalidad original)
        const loadYoutubeVideos = () => {
            return fetch('/youtube-links')
                .then(response => {
                    if (!response.ok) {
                        console.warn('No se encontraron enlaces de YouTube');
                        return [];
                    }
                    return response.json();
                })
                .then(links => {
                    if (!links || links.length === 0) {
                        console.warn('No hay enlaces de YouTube disponibles');
                        return [];
                    }
                    
                    console.log('Enlaces de YouTube encontrados:', links.length);
                    
                    // Procesar cada enlace de YouTube
                    links.forEach(link => {
                        // Crear el elemento de columna
                        const videoCol = document.createElement('div');
                        videoCol.className = 'col-md-6 col-lg-4 mb-4';
                        
                        // Crear un contenedor para el video con sombra y efectos
                        const videoContainer = document.createElement('div');
                        videoContainer.className = 'video-container shadow rounded overflow-hidden';
                        
                        // Crear el iframe para el video de YouTube
                        const iframe = document.createElement('iframe');
                        iframe.src = `https://www.youtube.com/embed/${link}`;
                        iframe.frameBorder = "0";
                        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                        iframe.allowFullscreen = true;
                        iframe.className = 'w-100';
                        iframe.style.height = '200px';
                        
                        // Agregar un título al video
                        const videoTitle = document.createElement('div');
                        videoTitle.className = 'video-title bg-light p-2 text-center';
                        videoTitle.textContent = 'Testimonio en YouTube';
                        
                        // Ensamblar los elementos
                        videoContainer.appendChild(iframe);
                        videoContainer.appendChild(videoTitle);
                        videoCol.appendChild(videoContainer);
                        videoTestimonialsContainer.appendChild(videoCol);
                        totalVideosAdded++;
                    });
                    
                    return links;
                })
                .catch(error => {
                    console.error('Error cargando enlaces de YouTube:', error);
                    return [];
                });
        };
        
        // Cargar ambos tipos de videos (locales y YouTube)
        Promise.all([loadLocalVideos(), loadYoutubeVideos()])
            .then(([localVideos, youtubeLinks]) => {
                console.log(`Total de videos añadidos: ${totalVideosAdded}`);
                
                // Si no se encontraron videos válidos
                if (totalVideosAdded === 0) {
                    videoTestimonialsContainer.innerHTML = `
                        <div class="col-12">
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle me-2"></i>
                                No hay videos de testimonios disponibles en este momento.
                            </div>
                        </div>
                    `;
                    
                    // Mostrar mensaje de ayuda para agregar videos
                    const helpLink = document.createElement('div');
                    helpLink.className = 'col-12 text-center mt-3';
                    helpLink.innerHTML = `
                        <a href="admin.html" class="btn btn-outline-primary">
                            <i class="fas fa-upload me-2"></i>Agregar videos
                        </a>
                    `;
                    videoTestimonialsContainer.appendChild(helpLink);
                }
            })
            .catch(error => {
                console.error('Error cargando videos de testimonios:', error);
                videoTestimonialsContainer.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-danger">
                            <i class="fas fa-exclamation-circle me-2"></i>
                            <div>
                                <h5 class="mb-1">Error al cargar los videos</h5>
                                <p class="mb-0">No se pudieron cargar los videos de testimonios.</p>
                                <button class="btn btn-outline-danger btn-sm mt-2" onclick="loadVideoTestimonials()">
                                    <i class="fas fa-sync-alt me-1"></i>Reintentar
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
    }

    // Función mejorada para verificar endpoints
    function checkVideoEndpoints() {
        const debugMessage = document.getElementById('debug-message');
        if (!debugMessage) return;
        
        debugMessage.innerHTML = '<div class="text-center my-3"><div class="spinner-border spinner-border-sm text-primary" role="status"></div> Verificando endpoints de videos...</div>';
        let reportHTML = '<h6 class="mb-3">Estado de las rutas:</h6>';
        
        // Agregar timeout a las peticiones para evitar esperas infinitas
        const fetchWithTimeout = (url, options = {}, timeout = 5000) => {
            return Promise.race([
                fetch(url, options),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error(`Timeout al acceder a ${url}`)), timeout)
                )
            ]);
        };
        
        // Verificar endpoint de videos locales
        fetchWithTimeout('/videos/testimonios')
            .then(response => {
                const statusClass = response.ok ? 'text-success' : 'text-danger';
                reportHTML += `
                    <div class="card mb-2">
                        <div class="card-body">
                            <h6 class="d-flex justify-content-between">
                                <span>Endpoint /videos/testimonios:</span> 
                                <span class="${statusClass}"><strong>${response.ok ? 'Disponible' : 'No disponible'}</strong></span>
                            </h6>
                            <div class="small text-muted">Status: ${response.status} ${response.statusText}</div>
                            ${!response.ok ? '<div class="small text-danger mt-1">Esta ruta debe estar configurada en el servidor.</div>' : ''}
                        </div>
                    </div>
                `;
                return fetchWithTimeout('/videos');
            })
            .then(response => {
                const statusClass = response.ok ? 'text-success' : 'text-danger';
                reportHTML += `
                    <div class="card mb-2">
                        <div class="card-body">
                            <h6 class="d-flex justify-content-between">
                                <span>Endpoint /videos:</span> 
                                <span class="${statusClass}"><strong>${response.ok ? 'Disponible' : 'No disponible'}</strong></span>
                            </h6>
                            <div class="small text-muted">Status: ${response.status} ${response.statusText}</div>
                        </div>
                    </div>
                `;
                return fetchWithTimeout('/youtube-links');
            })
            .then(response => {
                const statusClass = response.ok ? 'text-success' : 'text-danger';
                reportHTML += `
                    <div class="card mb-2">
                        <div class="card-body">
                            <h6 class="d-flex justify-content-between">
                                <span>Endpoint /youtube-links:</span> 
                                <span class="${statusClass}"><strong>${response.ok ? 'Disponible' : 'No disponible'}</strong></span>
                            </h6>
                            <div class="small text-muted">Status: ${response.status} ${response.statusText}</div>
                        </div>
                    </div>
                `;
                
                // Mostrar la información recopilada
                debugMessage.innerHTML = reportHTML;
                
                // Agregar sección de ayuda para configurar el servidor
                const helpSection = document.createElement('div');
                helpSection.className = 'mt-4 p-3 border rounded bg-light';
                helpSection.innerHTML = `
                    <h6 class="mb-3">Configuración del servidor:</h6>
                    <p>Para solucionar el problema de los videos, el servidor debe configurarse para responder a las siguientes rutas:</p>
                    <ul>
                        <li><code>/videos/testimonios</code> - Directorio principal de videos de testimonios</li>
                        <li><code>/youtube-links</code> - API para enlaces de videos de YouTube</li>
                    </ul>
                    <div class="mt-3">
                        <button class="btn btn-sm btn-info" onclick="showTroubleshootingHelp()">
                            <i class="fas fa-question-circle me-1"></i>Ayuda adicional
                        </button>
                    </div>
                `;
                debugMessage.appendChild(helpSection);
            })
            .catch(error => {
                debugMessage.innerHTML = `
                    <div class="alert alert-danger">
                        <p><i class="fas fa-exclamation-triangle me-2"></i>Error al verificar endpoints: ${error.message}</p>
                        <p class="mb-0 small">Esto puede indicar que el servidor no está en ejecución o que hay problemas de conectividad.</p>
                    </div>
                    <button class="btn btn-sm btn-primary mt-3" onclick="checkVideoEndpoints()">
                        <i class="fas fa-sync me-1"></i>Intentar nuevamente
                    </button>
                `;
            });
    }

    // Funciones para depuración (ayudan a diagnosticar problemas con los videos)
    function toggleDebugInfo() {
        const debugContainer = document.getElementById('debug-container');
        if (debugContainer) {
            if (debugContainer.style.display === 'none') {
                debugContainer.style.display = 'block';
                checkVideoEndpoints();
            } else {
                debugContainer.style.display = 'none';
            }
        }
    }

    function showTroubleshootingHelp() {
        const debugMessage = document.getElementById('debug-message');
        if (!debugMessage) return;
        
        debugMessage.innerHTML += `
            <div class="mt-3 p-3 border rounded">
                <h6>Solución de problemas:</h6>
                <ol>
                    <li>Verifica que el servidor esté ejecutándose correctamente</li>
                    <li>Los videos deben estar en la carpeta '/videos/testimonios' del servidor</li>
                    <li>Formatos soportados: mp4, webm, ogg, mov</li>
                    <li>Para enlaces de YouTube, asegúrate de que el endpoint '/youtube-links' esté configurado</li>
                    <li>Revisa los logs del servidor para identificar errores específicos</li>
                </ol>
            </div>
        `;
    }

    // Hacer las funciones de depuración accesibles globalmente
    window.toggleDebugInfo = toggleDebugInfo;
    window.checkVideoEndpoints = checkVideoEndpoints;
    window.showTroubleshootingHelp = showTroubleshootingHelp;
    
    // Asegurar que la función loadVideoTestimonials sea accesible globalmente
    window.loadVideoTestimonials = loadVideoTestimonials;
    
    // Llamar a las funciones de carga
    loadMainCarouselImages();
    loadVideoTestimonials();
});

// Añadir CSS para animaciones vía JavaScript
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .in-viewport {
            opacity: 1;
            transform: translateY(0);
        }
        
        .card-img-top {
            transition: transform 0.4s ease;
        }
        
        @media (prefers-reduced-motion: reduce) {
            .animate-on-scroll, .animate-fadeInUp {
                transition: none;
                animation: none;
                opacity: 1;
                transform: none;
            }
            
            .card-img-top {
                transition: none;
            }
        }
    </style>
`);