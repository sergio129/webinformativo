document.getElementById('media-upload').addEventListener('change', function(event) {
    const previewContainer = document.getElementById('preview');
    previewContainer.innerHTML = ''; // Limpia la previsualización anterior

    Array.from(event.target.files).forEach(file => {
        const fileType = file.type.split('/')[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            if (fileType === 'image') {
                const img = document.createElement('img');
                img.src = e.target.result;
                previewContainer.appendChild(img);
            } else if (fileType === 'video') {
                const video = document.createElement('video');
                video.src = e.target.result;
                video.controls = true;
                previewContainer.appendChild(video);
            }
        };

        reader.readAsDataURL(file);
    });
});

document.getElementById('carousel-upload')?.addEventListener('change', function(event) {
    const previewContainer = document.getElementById('admin-preview') || document.querySelector('.carousel-images');
    previewContainer.innerHTML = ''; // Limpia las imágenes existentes

    const files = Array.from(event.target.files);

    if (files.length === 0) {
        alert('Por favor, selecciona al menos una imagen.');
        return;
    }

    files.forEach(file => {
        if (file.type.startsWith('image/')) { // Verifica que sea un archivo de imagen
            const reader = new FileReader();

            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                previewContainer.appendChild(img);
            };

            reader.readAsDataURL(file);
        } else {
            alert('Solo se permiten archivos de imagen.');
        }
    });

    // Reinicia el índice del carrusel si es necesario
    if (previewContainer.classList.contains('carousel-images')) {
        currentIndex = 0;
    }
});

let currentIndex = 0;

function showNextImage() {
    const images = document.querySelectorAll('.carousel-images img');
    const totalImages = images.length;

    if (totalImages > 0) {
        currentIndex = (currentIndex + 1) % totalImages;
        const offset = -currentIndex * 100;
        document.querySelector('.carousel-images').style.transform = `translateX(${offset}%)`;
    }
}

setInterval(showNextImage, 3000); // Cambia de imagen cada 3 segundos

function loadCarouselImages() {
    const carouselContainer = document.querySelector('.carousel-images');
    const imagePreviewContainer = document.querySelector('#image-preview .image-list');
    carouselContainer.innerHTML = ''; // Limpia las imágenes existentes en el carrusel
    imagePreviewContainer.innerHTML = ''; // Limpia las imágenes existentes en el contenedor de depuración

    // Cargar imágenes desde la carpeta "imagenes"
    fetch('/imagenes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las imágenes.');
            }
            return response.json();
        })
        .then(images => {
            console.log('Imágenes obtenidas del servidor:', images); // Depuración

            if (images.length === 0) {
                console.warn('No hay imágenes disponibles en la carpeta.');
                return;
            }

            images.forEach(image => {
                const imagePath = `/imagenes/${image}`;
                console.log('Ruta de la imagen:', imagePath); // Depuración

                // Agregar imagen al carrusel
                const img = document.createElement('img');
                img.src = imagePath;
                img.alt = `Imagen del carrusel: ${image}`;
                img.style.border = '2px solid red'; // Agrega un borde rojo para depuración visual
                carouselContainer.appendChild(img);
                console.log('Imagen agregada al carrusel:', img); // Depuración

                // Agregar imagen al contenedor de depuración
                const previewImg = document.createElement('img');
                previewImg.src = imagePath;
                previewImg.alt = `Imagen cargada: ${image}`;
                previewImg.style.maxWidth = '100px'; // Tamaño pequeño para depuración
                previewImg.style.margin = '5px';
                previewImg.style.border = '2px solid blue'; // Agrega un borde azul para depuración visual
                imagePreviewContainer.appendChild(previewImg);
                console.log('Imagen agregada al contenedor de depuración:', previewImg); // Depuración
            });

            // Reinicia el índice del carrusel
            currentIndex = 0;
        })
        .catch(error => console.error('Error cargando imágenes:', error));
}

// Llama a esta función al cargar la página
loadCarouselImages();

// Función para cargar imágenes en la lista administrativa
function loadAdminImages() {
    const adminImageList = document.getElementById('admin-image-list');
    adminImageList.innerHTML = ''; // Limpia las imágenes existentes

    fetch('/imagenes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las imágenes.');
            }
            return response.json();
        })
        .then(images => {
            if (images.length === 0) {
                adminImageList.innerHTML = '<p>No hay imágenes cargadas.</p>';
                return;
            }

            images.forEach(image => {
                const imagePath = `/imagenes/${image}`;
                const imageContainer = document.createElement('div');
                imageContainer.classList.add('image-item');

                const img = document.createElement('img');
                img.src = imagePath;
                img.alt = `Imagen: ${image}`;
                img.classList.add('admin-image');

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Eliminar';
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', () => {
                    fetch(`/imagenes/${image}`, { method: 'DELETE' })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error al eliminar la imagen.');
                            }
                            loadAdminImages(); // Recargar la lista de imágenes
                        })
                        .catch(error => console.error('Error eliminando la imagen:', error));
                });

                imageContainer.appendChild(img);
                imageContainer.appendChild(deleteButton);
                adminImageList.appendChild(imageContainer);
            });
        })
        .catch(error => console.error('Error cargando imágenes:', error));
}

// Función para cargar videos en la lista administrativa
function loadAdminVideos() {
    const adminVideoList = document.getElementById('admin-video-list');
    adminVideoList.innerHTML = ''; // Limpia los videos existentes

    fetch('/videos/testimonios')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los videos.');
            }
            return response.json();
        })
        .then(videos => {
            if (videos.length === 0) {
                adminVideoList.innerHTML = '<p>No hay videos cargados.</p>';
                return;
            }

            videos.forEach(video => {
                const videoPath = `/videos/testimonios/${video}`;
                const videoContainer = document.createElement('div');
                videoContainer.classList.add('video-item');

                const videoElement = document.createElement('video');
                videoElement.src = videoPath;
                videoElement.controls = true;
                videoElement.style.maxWidth = '200px';
                videoElement.style.margin = '10px';

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Eliminar';
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', () => {
                    fetch(`/videos/testimonios/${video}`, { method: 'DELETE' })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error al eliminar el video.');
                            }
                            loadAdminVideos(); // Recargar la lista de videos
                        })
                        .catch(error => console.error('Error eliminando el video:', error));
                });

                videoContainer.appendChild(videoElement);
                videoContainer.appendChild(deleteButton);
                adminVideoList.appendChild(videoContainer);
            });
        })
        .catch(error => console.error('Error cargando videos:', error));
}

// Llama a esta función al cargar la página de administración
if (document.getElementById('admin-video-list')) loadAdminVideos();

// Función para cargar enlaces de YouTube
function loadYoutubeLinks() {
    const youtubeLinksList = document.getElementById('youtube-links-list');
    youtubeLinksList.innerHTML = ''; // Limpia los enlaces existentes

    fetch('/youtube-links')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los enlaces de YouTube.');
            }
            return response.json();
        })
        .then(links => {
            if (links.length === 0) {
                youtubeLinksList.innerHTML = '<p>No hay enlaces de YouTube cargados.</p>';
                return;
            }

            links.forEach(link => {
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${link}`;
                iframe.allowFullscreen = true;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Eliminar';
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', () => {
                    fetch(`/youtube-links/${link}`, { method: 'DELETE' })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error al eliminar el enlace de YouTube.');
                            }
                            loadYoutubeLinks(); // Recargar la lista de enlaces
                        })
                        .catch(error => console.error('Error eliminando el enlace de YouTube:', error));
                });

                const linkContainer = document.createElement('div');
                linkContainer.classList.add('youtube-item');
                linkContainer.appendChild(iframe);
                linkContainer.appendChild(deleteButton);
                youtubeLinksList.appendChild(linkContainer);
            });
        })
        .catch(error => console.error('Error cargando enlaces de YouTube:', error));
}

// Llama a las funciones al cargar la página
if (document.getElementById('admin-image-list')) loadAdminImages();
if (document.getElementById('admin-video-list')) loadAdminVideos();
if (document.getElementById('youtube-links-list')) loadYoutubeLinks();
