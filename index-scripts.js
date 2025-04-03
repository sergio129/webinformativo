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
            return fetch('/videos/testimonios')
                .then(response => {
                    if (!response.ok) {
                        console.warn('No se encontraron videos en /videos/testimonios, intentando ruta alternativa...');
                        return fetch('/videos');
                    }
                    return response;
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al obtener los videos locales');
                    }
                    return response.json();
                })
                .then(videos => {
                    if (!videos) {
                        console.warn('No hay respuesta de videos válida');
                        return [];
                    }
                    
                    // Verificar si videos es un array
                    let videosArray = videos;
                    if (!Array.isArray(videos)) {
                        console.warn('La respuesta de videos no es un array, intentando convertir:', videos);
                        
                        if (typeof videos === 'object') {
                            videosArray = Object.values(videos);
                        } else {
                            console.error('Formato de respuesta de videos no válido:', videos);
                            return [];
                        }
                    }
                    
                    if (videosArray.length === 0) {
                        console.warn('No hay videos locales disponibles');
                        return [];
                    }
                    
                    console.log('Videos locales encontrados:', videosArray.length);
                    
                    // Filtrar solo archivos de video válidos
                    const validVideos = videosArray.filter(video => {
                        if (typeof video !== 'string') {
                            console.warn('Elemento de video no válido:', video);
                            return false;
                        }
                        const extension = video.split('.').pop().toLowerCase();
                        return ['mp4', 'webm', 'ogg', 'mov'].includes(extension);
                    });
                    
                    console.log('Videos válidos encontrados:', validVideos.length);
                    
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
                            // Intentar con ruta alternativa
                            this.src = `/videos/${video}`;
                            
                            // Si vuelve a fallar, mostrar un mensaje de error más amigable
                            this.onerror = function() {
                                videoContainer.innerHTML = `
                                    <div class="p-4 text-center">
                                        <i class="fas fa-exclamation-triangle text-warning mb-2" style="font-size: 2rem;"></i>
                                        <p class="mb-0">No se pudo cargar el video "${video}"</p>
                                    </div>
                                `;
                            };
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
                    console.error("Error cargando videos locales:", error);
                    return [];
                });
        };
        
        // Función para cargar videos de YouTube
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
                    if (!links) {
                        console.warn('No hay respuesta de enlaces válida');
                        return [];
                    }
                    
                    // Verificar si links es un array
                    let linksArray = links;
                    if (!Array.isArray(links)) {
                        console.warn('La respuesta de enlaces no es un array, intentando convertir:', links);
                        
                        if (typeof links === 'object') {
                            linksArray = Object.values(links);
                        } else {
                            console.error('Formato de respuesta de enlaces no válido:', links);
                            return [];
                        }
                    }
                    
                    if (linksArray.length === 0) {
                        console.warn('No hay enlaces de YouTube disponibles');
                        return [];
                    }
                    
                    console.log('Enlaces de YouTube encontrados:', linksArray.length);
                    
                    // Procesar cada enlace de YouTube
                    linksArray.forEach(link => {
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
                    
                    return linksArray;
                })
                .catch(error => {
                    console.error("Error cargando enlaces de YouTube:", error);
                    return [];
                });
        };
        
        // Cargar ambos tipos de videos y luego verificar si se añadió alguno
        Promise.all([loadLocalVideos(), loadYoutubeVideos()])
            .then(([localVideos, youtubeLinks]) => {
                console.log(`Total de videos añadidos: ${totalVideosAdded}`);
                
                // Si no se encontraron videos válidos después de filtrar
                if (totalVideosAdded === 0) {
                    videoTestimonialsContainer.innerHTML = `
                        <div class="col-12">
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle me-2"></i>
                                <p>No hay videos de testimonios disponibles en este momento.</p>
                                <small class="d-block mt-2">Para agregar videos, acceda al panel de administración.</small>
                            </div>
                        </div>
                    `;
                    // Mostrar info de depuración si no hay videos
                    document.getElementById('debug-info').style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error cargando videos de testimonios:', error);
                videoTestimonialsContainer.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-danger d-flex align-items-center">
                            <i class="fas fa-exclamation-circle me-3" style="font-size: 1.5rem;"></i>
                            <div>
                                <h5 class="mb-1">Error al cargar los videos</h5>
                                <p class="mb-0">No se pudieron cargar los videos de testimonios.</p>
                                <p class="mb-0 text-muted small">${error.toString()}</p>
                                <button class="btn btn-outline-danger btn-sm mt-2" onclick="loadVideoTestimonials()">Reintentar</button>
                            </div>
                        </div>
                    </div>
                `;
                // Mostrar panel de depuración si hay error
                document.getElementById('debug-info').style.display = 'block';
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

    function checkVideoEndpoints() {
        const debugMessage = document.getElementById('debug-message');
        if (!debugMessage) return;
        
        debugMessage.innerHTML = '<p>Verificando endpoints de videos...</p>';
        let reportHTML = '';
        
        // Verificar endpoint de videos locales
        fetch('/videos/testimonios')
            .then(response => {
                reportHTML += `<p>Endpoint /videos/testimonios: <strong>${response.ok ? 'Disponible' : 'No disponible'}</strong> (status: ${response.status})</p>`;
                return fetch('/videos');
            })
            .then(response => {
                reportHTML += `<p>Endpoint /videos: <strong>${response.ok ? 'Disponible' : 'No disponible'}</strong> (status: ${response.status})</p>`;
                return fetch('/youtube-links');
            })
            .then(response => {
                reportHTML += `<p>Endpoint /youtube-links: <strong>${response.ok ? 'Disponible' : 'No disponible'}</strong> (status: ${response.status})</p>`;
                
                // Mostrar la información recopilada
                debugMessage.innerHTML = reportHTML;
                
                // Mostrar botón para ayuda adicional
                const helpButton = document.createElement('button');
                helpButton.className = 'btn btn-sm btn-info mt-2';
                helpButton.textContent = 'Ayuda adicional';
                helpButton.onclick = showTroubleshootingHelp;
                debugMessage.appendChild(helpButton);
            })
            .catch(error => {
                debugMessage.innerHTML = `<p class="text-danger">Error al verificar endpoints: ${error.message}</p>`;
            });
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