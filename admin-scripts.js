/**
 * Scripts para la funcionalidad del panel de administración
 */

document.addEventListener('DOMContentLoaded', function() {
    // Navegación entre secciones
    const navItems = document.querySelectorAll('.admin-nav-item');
    const sections = document.querySelectorAll('.admin-section');
    
    // Inicializar contador de estadísticas
    updateStatCounts();
    
    // Manejar navegación con hash URL
    function handleHashChange() {
        const hash = window.location.hash.substring(1) || 'dashboard';
        
        // Activar elemento de navegación correspondiente
        navItems.forEach(item => {
            if (item.dataset.section === hash) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Mostrar sección correspondiente
        sections.forEach(section => {
            if (section.id === hash) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }
    
    // Escuchar cambios en el hash
    window.addEventListener('hashchange', handleHashChange);
    
    // Iniciar con el hash actual
    handleHashChange();
    
    // Navegación al hacer clic
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.dataset.section;
            window.location.hash = targetSection;
        });
    });
    
    // Manejar subida de imágenes de carrusel
    const carouselUpload = document.getElementById('carousel-upload');
    if (carouselUpload) {
        carouselUpload.addEventListener('change', function(event) {
            const adminPreview = document.getElementById('admin-preview');
            adminPreview.innerHTML = '';
            
            const files = Array.from(event.target.files);
            if (files.length === 0) return;
            
            files.forEach((file, index) => {
                if (!file.type.match('image.*')) return;
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'preview-item';
                    
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = `Preview ${index + 1}`;
                    
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'remove-preview';
                    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                    removeBtn.onclick = function() {
                        previewItem.remove();
                    };
                    
                    previewItem.appendChild(img);
                    previewItem.appendChild(removeBtn);
                    adminPreview.appendChild(previewItem);
                };
                
                reader.readAsDataURL(file);
            });
        });
        
        // Permitir drag and drop
        const uploadContainer = document.querySelector('.file-upload-container');
        if (uploadContainer) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                uploadContainer.addEventListener(eventName, preventDefaults, false);
            });
            
            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            uploadContainer.addEventListener('dragover', function() {
                this.classList.add('highlight');
            });
            
            uploadContainer.addEventListener('dragleave', function() {
                this.classList.remove('highlight');
            });
            
            uploadContainer.addEventListener('drop', function(e) {
                this.classList.remove('highlight');
                const dt = e.dataTransfer;
                const files = dt.files;
                carouselUpload.files = files;
                
                // Disparar manualmente el evento change
                const event = new Event('change');
                carouselUpload.dispatchEvent(event);
            });
        }
    }
    
    // Manejar subida de videos de testimonios
    const mediaUpload = document.getElementById('media-upload');
    if (mediaUpload) {
        mediaUpload.addEventListener('change', function(event) {
            // Mostrar los videos seleccionados en la interfaz
            const videoNamesList = document.getElementById('video-names-list');
            const selectedVideosCount = document.getElementById('selected-videos-count');
            
            if (videoNamesList && selectedVideosCount) {
                videoNamesList.innerHTML = '';
                const files = Array.from(event.target.files);
                selectedVideosCount.textContent = files.length;
                
                files.forEach(file => {
                    const fileItem = document.createElement('div');
                    fileItem.className = 'selected-file-item';
                    
                    const fileName = document.createElement('div');
                    fileName.className = 'selected-file-name';
                    fileName.textContent = file.name;
                    
                    const fileSize = document.createElement('div');
                    fileSize.className = 'selected-file-size';
                    fileSize.textContent = formatFileSize(file.size);
                    
                    fileItem.appendChild(fileName);
                    fileItem.appendChild(fileSize);
                    videoNamesList.appendChild(fileItem);
                });
            }
        });
        
        // Permitir drag and drop para videos también
        const videoUploadContainer = document.querySelector('#videos .file-upload-container');
        if (videoUploadContainer) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                videoUploadContainer.addEventListener(eventName, preventDefaults, false);
            });
            
            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            videoUploadContainer.addEventListener('dragover', function() {
                this.classList.add('highlight');
            });
            
            videoUploadContainer.addEventListener('dragleave', function() {
                this.classList.remove('highlight');
            });
            
            videoUploadContainer.addEventListener('drop', function(e) {
                this.classList.remove('highlight');
                const dt = e.dataTransfer;
                const files = dt.files;
                mediaUpload.files = files;
                
                // Disparar manualmente el evento change
                const event = new Event('change');
                mediaUpload.dispatchEvent(event);
            });
        }
    }
    
    // Procesar el formulario de carga de videos
    const uploadVideoForm = document.getElementById('upload-video-form');
    if (uploadVideoForm) {
        uploadVideoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const mediaUpload = document.getElementById('media-upload');
            if (!mediaUpload || mediaUpload.files.length === 0) {
                showNotification('Por favor selecciona al menos un video', 'warning');
                return;
            }
            
            // Mostrar indicador de carga
            showNotification('Subiendo videos, por favor espere...', 'info');
            
            // Crear FormData con los videos seleccionados
            const formData = new FormData();
            Array.from(mediaUpload.files).forEach(file => {
                formData.append('testimonialVideos', file); // Cambiar el nombre del campo para que coincida con el backend
            });
            
            // Usar la ruta correcta que funcionaba anteriormente
            fetch('/api/upload-testimonial-videos', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al subir los videos. Código: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                showNotification('Videos subidos correctamente', 'success');
                
                // Limpiar el formulario
                mediaUpload.value = '';
                const videoNamesList = document.getElementById('video-names-list');
                const selectedVideosCount = document.getElementById('selected-videos-count');
                if (videoNamesList) videoNamesList.innerHTML = '';
                if (selectedVideosCount) selectedVideosCount.textContent = '0';
                
                // Recargar la lista de videos
                loadAdminVideos();
                
                // Actualizar contador
                updateVideoCount();
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Error al subir los videos: ' + error.message, 'error');
            });
        });
    }
    
    // Manejar formulario de agregar enlaces de YouTube
    const addYoutubeForm = document.getElementById('add-youtube-form');
    if (addYoutubeForm) {
        addYoutubeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const linkInput = document.getElementById('youtube-link');
            let videoId = linkInput.value.trim();
            
            // Extraer ID de video de URL completa si es necesario
            if (videoId.includes('youtube.com') || videoId.includes('youtu.be')) {
                // Extraer videoId de la URL
                const url = new URL(videoId);
                if (videoId.includes('youtube.com')) {
                    videoId = url.searchParams.get('v');
                } else if (videoId.includes('youtu.be')) {
                    videoId = url.pathname.substring(1);
                }
            }
            
            if (!videoId) {
                showNotification('Por favor ingresa un ID o URL de YouTube válido', 'warning');
                return;
            }
            
            // Aquí vendría la lógica para guardar el ID en el servidor
            // Por ahora solo mostramos un mensaje
            showNotification('Enlace de YouTube agregado correctamente', 'success');
            linkInput.value = '';
            
            // Recargar la lista de enlaces
            loadYoutubeLinks();
        });
    }
    
    // Actualizar contadores de estadísticas
    function updateStatCounts() {
        // Estas funciones deberían obtener los conteos reales de la base de datos
        updateImageCount();
        updateVideoCount();
        updateYoutubeCount();
    }
    
    // Función para mostrar notificaciones toast
    function showNotification(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `admin-toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fa ${getIconForType(type)}"></i>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(toast);
        
        // Mostrar el toast
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Auto cerrar después de 5 segundos
        const autoClose = setTimeout(() => {
            closeToast(toast);
        }, 5000);
        
        // Botón de cerrar
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoClose);
            closeToast(toast);
        });
        
        function getIconForType(type) {
            switch (type) {
                case 'success': return 'fa-check-circle';
                case 'error': return 'fa-exclamation-circle';
                case 'warning': return 'fa-exclamation-triangle';
                default: return 'fa-info-circle';
            }
        }
        
        function closeToast(toast) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }
    }
});

// Funciones para actualizar contadores (se conectan con el backend)
function updateImageCount() {
    fetch('/imagenes')
        .then(response => response.json())
        .then(images => {
            const count = images.length || 0;
            document.getElementById('image-count').textContent = count;
        })
        .catch(error => {
            console.error('Error al obtener conteo de imágenes:', error);
            document.getElementById('image-count').textContent = '0';
        });
}

function updateVideoCount() {
    fetch('/api/testimonial-videos')
        .then(response => response.json())
        .then(videos => {
            const count = videos.length || 0;
            const videoCount = document.getElementById('video-count');
            if (videoCount) {
                videoCount.textContent = count;
            }
        })
        .catch(error => {
            console.error('Error al obtener conteo de videos:', error);
            const videoCount = document.getElementById('video-count');
            if (videoCount) {
                videoCount.textContent = '0';
            }
        });
}

function updateYoutubeCount() {
    fetch('/youtube-links')
        .then(response => response.json())
        .then(links => {
            const count = links.length || 0;
            document.getElementById('youtube-count').textContent = count;
        })
        .catch(error => {
            console.error('Error al obtener conteo de enlaces de YouTube:', error);
            document.getElementById('youtube-count').textContent = '0';
        });
}

// Cargar videos para administración
function loadAdminVideos() {
    const videoList = document.getElementById('admin-video-list');
    if (!videoList) return;
    
    // Mostrar indicador de carga
    videoList.innerHTML = '<div class="col-12 text-center p-3"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Cargando videos...</p></div>';
    
    // Obtener videos del servidor - usar la ruta correcta
    fetch('/api/testimonial-videos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los videos');
            }
            return response.json();
        })
        .then(videos => {
            // Limpiar la lista
            videoList.innerHTML = '';
            
            if (!Array.isArray(videos) || videos.length === 0) {
                videoList.innerHTML = '<div class="col-12 text-center p-3"><p>No hay videos disponibles</p></div>';
                return;
            }
            
            // Mostrar cada video
            videos.forEach(video => {
                if (typeof video !== 'string') return;
                
                const videoPath = `/videos/testimonios/${video}`;
                const videoItem = document.createElement('div');
                videoItem.className = 'admin-media-item';
                
                const videoElement = document.createElement('video');
                videoElement.src = videoPath;
                videoElement.className = 'video-preview';
                videoElement.controls = true; // Añadir controles al video
                
                const mediaOverlay = document.createElement('div');
                mediaOverlay.className = 'media-overlay';
                
                const mediaTitle = document.createElement('div');
                mediaTitle.className = 'media-title';
                mediaTitle.textContent = video.split('.')[0].replace(/_/g, ' '); // Formato del título
                
                const mediaActions = document.createElement('div');
                mediaActions.className = 'media-actions';
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'media-action-btn delete';
                deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
                deleteBtn.title = 'Eliminar video';
                deleteBtn.onclick = function() {
                    deleteVideo(video);
                };
                
                // Ensamblar elementos
                mediaActions.appendChild(deleteBtn);
                mediaOverlay.appendChild(mediaTitle);
                
                videoItem.appendChild(videoElement);
                videoItem.appendChild(mediaOverlay);
                videoItem.appendChild(mediaActions);
                
                videoList.appendChild(videoItem);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            videoList.innerHTML = `<div class="col-12 text-center p-3"><p class="text-danger">Error al cargar los videos: ${error.message}</p></div>`;
        });
}

// Función para eliminar videos
function deleteVideo(videoName) {
    // Mostrar indicador de carga
    showNotification('Eliminando video...', 'info');
    
    // Enviar solicitud para eliminar el video - usar la ruta correcta
    fetch(`/api/testimonial-videos?videoName=${encodeURIComponent(videoName)}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.status === 204) {
            return { success: true };
        }
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        try {
            return response.json();
        } catch (e) {
            return { success: true };
        }
    })
    .then(data => {
        showNotification('Video eliminado correctamente', 'success');
        
        // Recargar la lista de videos
        loadAdminVideos();
        
        // Actualizar contador
        updateVideoCount();
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error al eliminar el video: ' + error.message, 'error');
    });
}

// Cargar imágenes para administración
function loadAdminImages() {
    const imageList = document.getElementById('admin-image-list');
    if (!imageList) return;
    
    // Mostrar indicador de carga
    imageList.innerHTML = '<div class="col-12 text-center p-3"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Cargando imágenes...</p></div>';
    
    fetch('/imagenes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las imágenes');
            }
            return response.json();
        })
        .then(images => {
            // Limpiar la lista
            imageList.innerHTML = '';
            
            if (!Array.isArray(images) || images.length === 0) {
                imageList.innerHTML = '<div class="col-12 text-center p-3"><p>No hay imágenes disponibles</p></div>';
                return;
            }
            
            // Mostrar cada imagen
            images.forEach(image => {
                if (typeof image !== 'string') return;
                
                const imagePath = `/imagenes/${image}`;
                const imageItem = document.createElement('div');
                imageItem.className = 'admin-media-item';
                
                const img = document.createElement('img');
                img.src = imagePath;
                img.alt = image;
                img.loading = 'lazy';
                
                const mediaOverlay = document.createElement('div');
                mediaOverlay.className = 'media-overlay';
                
                const mediaTitle = document.createElement('div');
                mediaTitle.className = 'media-title';
                mediaTitle.textContent = image.split('.')[0].replace(/_/g, ' '); // Formato del título
                
                const mediaActions = document.createElement('div');
                mediaActions.className = 'media-actions';
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'media-action-btn delete';
                deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
                deleteBtn.title = 'Eliminar imagen';
                deleteBtn.onclick = function() {
                    deleteImage(image);
                };
                
                // Ensamblar elementos
                mediaActions.appendChild(deleteBtn);
                mediaOverlay.appendChild(mediaTitle);
                
                imageItem.appendChild(img);
                imageItem.appendChild(mediaOverlay);
                imageItem.appendChild(mediaActions);
                
                imageList.appendChild(imageItem);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            imageList.innerHTML = `<div class="col-12 text-center p-3"><p class="text-danger">Error al cargar las imágenes: ${error.message}</p></div>`;
        });
}

// Función para eliminar imágenes
function deleteImage(imageName) {
    showNotification('Eliminando imagen...', 'info');
    
    fetch(`/api/delete-image?key=${encodeURIComponent(imageName)}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.status === 204) {
            return { success: true };
        }
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        try {
            return response.json();
        } catch (e) {
            return { success: true };
        }
    })
    .then(data => {
        showNotification('Imagen eliminada correctamente', 'success');
        loadAdminImages();
        updateImageCount();
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error al eliminar la imagen: ' + error.message, 'error');
    });
}

// Procesar el formulario de carga de imágenes para el carrusel
const uploadCarouselForm = document.getElementById('upload-carousel-form');
if (uploadCarouselForm) {
    uploadCarouselForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const carouselUpload = document.getElementById('carousel-upload');
        if (!carouselUpload || carouselUpload.files.length === 0) {
            showNotification('Por favor selecciona al menos una imagen', 'warning');
            return;
        }
        
        showNotification('Subiendo imágenes, por favor espere...', 'info');
        
        const formData = new FormData();
        Array.from(carouselUpload.files).forEach(file => {
            formData.append('imagenes', file);
        });
        
        fetch('/api/upload-images', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al subir las imágenes. Código: ' + response.status);
            }
            try {
                return response.json();
            } catch (e) {
                return { success: true };
            }
        })
        .then(data => {
            showNotification('Imágenes subidas correctamente', 'success');
            
            // Limpiar el formulario
            carouselUpload.value = '';
            const adminPreview = document.getElementById('admin-preview');
            if (adminPreview) adminPreview.innerHTML = '';
            
            // Recargar la lista de imágenes
            loadAdminImages();
            
            // Actualizar contador
            updateImageCount();
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error al subir las imágenes: ' + error.message, 'error');
        });
    });
}

// Hacer funciones accesibles globalmente
window.loadAdminImages = loadAdminImages;
window.deleteImage = deleteImage;
window.loadAdminVideos = loadAdminVideos;
window.deleteVideo = deleteVideo;

// Función para formatear el tamaño del archivo
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Añadir estilos para las notificaciones toast
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .admin-toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            padding: 15px;
            min-width: 300px;
            background-color: white;
            color: #333;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .admin-toast.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .admin-toast::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 5px;
            border-radius: 8px 0 0 8px;
        }
        
        .admin-toast.success::before {
            background-color: #4CAF50;
        }
        
        .admin-toast.error::before {
            background-color: #F44336;
        }
        
        .admin-toast.info::before {
            background-color: #2196F3;
        }
        
        .admin-toast.warning::before {
            background-color: #FFC107;
        }
        
        .toast-content {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .toast-content i {
            font-size: 24px;
        }
        
        .toast-content .fa-check-circle {
            color: #4CAF50;
        }
        
        .toast-content .fa-exclamation-circle {
            color: #F44336;
        }
        
        .toast-content .fa-info-circle {
            color: #2196F3;
        }
        
        .toast-content .fa-exclamation-triangle {
            color: #FFC107;
        }
        
        .toast-message {
            flex: 1;
            font-size: 14px;
        }
        
        .toast-close {
            background: none;
            border: none;
            cursor: pointer;
            color: #aaa;
            transition: color 0.2s;
        }
        
        .toast-close:hover {
            color: #333;
        }
        
        @media (max-width: 480px) {
            .admin-toast {
                width: calc(100% - 30px);
                left: 15px;
                right: 15px;
                min-width: auto;
            }
        }
        
        /* Estilos para el drag and drop */
        .file-upload-container.highlight {
            border-color: #3f51b5;
            background-color: rgba(63, 81, 181, 0.1);
        }
    </style>
`);
