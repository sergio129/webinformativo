// Asegurarse de que el elemento exista antes de agregar el evento
const mediaUpload = document.getElementById('media-upload');
if (mediaUpload) {
    mediaUpload.addEventListener('change', function(event) {
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
}

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

// Asegurarse de que el contenedor del carrusel exista antes de usarlo
function loadCarouselImages() {
    const carouselContainer = document.querySelector('.carousel-images');
    if (!carouselContainer) {
        console.error('El contenedor del carrusel no existe.');
        return;
    }

    const imagePreviewContainer = document.querySelector('#image-preview .image-list');
    if (imagePreviewContainer) {
        imagePreviewContainer.innerHTML = ''; // Limpia las imágenes existentes en el contenedor de depuración
    }

    carouselContainer.innerHTML = ''; // Limpia las imágenes existentes en el carrusel

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
                carouselContainer.appendChild(img);
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

// Calculadora de ROI
function calcularROI(event) {
    event.preventDefault();
    const erroresEvitados = document.getElementById('errores').value;
    const horasAhorradas = document.getElementById('horas').value;
    const roi = (erroresEvitados * 1000) + (horasAhorradas * 50); // Fórmula ficticia
    const resultado = document.getElementById('resultado-roi');
    resultado.innerText = `Ahorro estimado: $${roi} USD/año`;
    resultado.style.width = `${Math.min(roi / 100, 100)}%`; // Barra animada
    resultado.classList.add('barra-animada');
}

// Demo de Herramientas de Testing
function simularTesting() {
    const consola = document.getElementById('consola-testing');
    consola.innerHTML = ''; // Limpia la consola
    const logs = [
        'Iniciando test automatizado...',
        'Cargando módulos...',
        'Ejecutando pruebas...',
        '¡Se encontraron 3 bugs críticos!',
    ];
    let index = 0;
    const interval = setInterval(() => {
        if (index < logs.length) {
            const log = document.createElement('p');
            log.innerText = logs[index];
            consola.appendChild(log);
            index++;
        } else {
            clearInterval(interval);
        }
    }, 1000);
}

// Inicializar la variable antes de usarla
let casosGenerados = [];

// Generador Automático de Casos de Prueba
function generarCasos(event) {
    event.preventDefault();
    const nombreApp = document.getElementById('nombre-app').value.trim();
    const numeroCasos = parseInt(document.getElementById('numero-casos').value.trim(), 10);

    if (!nombreApp || isNaN(numeroCasos) || numeroCasos <= 0) {
        alert('Por favor, ingresa un nombre de la aplicación válido y un número de casos mayor a 0.');
        return;
    }

    casosGenerados = generarCasosDePrueba(nombreApp, numeroCasos);
    mostrarCasosEnModal(); // Muestra los casos en la modal automáticamente
}

// Algoritmo para generar casos de prueba
function generarCasosDePrueba(nombreApp, numeroCasos) {
    const casos = [];
    for (let i = 1; i <= numeroCasos; i++) {
        casos.push({
            id: `CP-${i.toString().padStart(3, '0')}`, // ID con formato CP-001, CP-002, etc.
            nombre: `Caso de Prueba ${i} para ${nombreApp}`,
            descripcion: `Este caso de prueba valida la funcionalidad ${i} en la aplicación ${nombreApp}.`,
            resultadoEsperado: `La funcionalidad ${i} debe comportarse según los requisitos establecidos en ${nombreApp}.`
        });
    }
    return casos;
}

// Mostrar los casos en la modal
function mostrarCasosEnModal() {
    const modal = document.getElementById('modal-casos');
    if (!modal) {
        console.error('El modal de casos no existe.');
        return;
    }

    const contenedorCasos = document.getElementById('contenedor-casos');
    if (!contenedorCasos) {
        console.error('El contenedor de casos no existe.');
        return;
    }

    contenedorCasos.innerHTML = ''; // Limpia el contenido previo

    if (casosGenerados.length === 0) {
        contenedorCasos.innerHTML = '<p>No hay casos de prueba generados. Por favor, genera algunos primero.</p>';
    } else {
        const table = document.createElement('table');
        table.classList.add('casos-table');

        // Crear encabezados de la tabla
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Resultado Esperado</th>
            </tr>
        `;
        table.appendChild(thead);

        // Crear cuerpo de la tabla
        const tbody = document.createElement('tbody');
        casosGenerados.forEach(caso => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${caso.id}</td>
                <td>${caso.nombre}</td>
                <td>${caso.descripcion}</td>
                <td>${caso.resultadoEsperado}</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        contenedorCasos.appendChild(table);
    }

    modal.style.display = 'block'; // Abre la modal
}

// Cerrar el modal de casos de prueba
function cerrarModalCasos() {
    const modal = document.getElementById('modal-casos');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Abrir el modal del quiz
function abrirQuiz() {
    document.getElementById('quiz-modal').style.display = 'block';
    iniciarQuiz();
}

// Cerrar el modal del quiz
function cerrarQuiz() {
    document.getElementById('quiz-modal').style.display = 'none';
}

// Test de Conocimientos QA
function iniciarQuiz() {
    const preguntas = [
        { pregunta: "¿Qué es Selenium?", respuesta: "Herramienta de automatización" },
        { pregunta: "¿Qué es un test de regresión?", respuesta: "Prueba para verificar que los cambios no rompan funcionalidades existentes" },
        { pregunta: "¿Qué significa QA?", respuesta: "Quality Assurance" },
        { pregunta: "¿Qué es un test unitario?", respuesta: "Prueba de una unidad de código" },
        { pregunta: "¿Qué es un test de integración?", respuesta: "Prueba de interacción entre módulos" },
        { pregunta: "¿Qué es un test de carga?", respuesta: "Prueba para medir el rendimiento bajo carga" },
        { pregunta: "¿Qué es un bug?", respuesta: "Error en el software" },
        { pregunta: "¿Qué es un test exploratorio?", respuesta: "Prueba sin casos predefinidos" },
        { pregunta: "¿Qué es un test funcional?", respuesta: "Prueba de funcionalidades del sistema" },
        { pregunta: "¿Qué es un test de estrés?", respuesta: "Prueba para medir el límite del sistema" },
        { pregunta: "¿Qué es un test de aceptación?", respuesta: "Prueba para validar requisitos del cliente" },
        { pregunta: "¿Qué es un test de seguridad?", respuesta: "Prueba para identificar vulnerabilidades" },
        { pregunta: "¿Qué es un test de usabilidad?", respuesta: "Prueba para evaluar la experiencia del usuario" },
        { pregunta: "¿Qué es un test automatizado?", respuesta: "Prueba ejecutada por herramientas" },
        { pregunta: "¿Qué es un caso de prueba?", respuesta: "Conjunto de condiciones para validar un requisito" },
        { pregunta: "¿Qué es un plan de pruebas?", respuesta: "Documento que define el alcance y enfoque de las pruebas" },
        { pregunta: "¿Qué es un script de prueba?", respuesta: "Código para ejecutar pruebas automatizadas" },
        { pregunta: "¿Qué es un entorno de pruebas?", respuesta: "Ambiente configurado para ejecutar pruebas" },
        { pregunta: "¿Qué es un test de compatibilidad?", respuesta: "Prueba en diferentes dispositivos y navegadores" },
        { pregunta: "¿Qué es un test de rendimiento?", respuesta: "Prueba para medir la velocidad y estabilidad del sistema" },
    ];

    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = ''; // Limpia el contenedor
    let puntaje = 0;

    preguntas.forEach((q, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
            <p>${index + 1}. ${q.pregunta}</p>
            <input type="text" id="respuesta-${index}" placeholder="Tu respuesta">
        `;
        quizContainer.appendChild(div);
    });

    const button = document.createElement('button');
    button.innerText = 'Enviar Respuestas';
    button.onclick = () => {
        preguntas.forEach((q, index) => {
            const respuesta = document.getElementById(`respuesta-${index}`).value;
            if (respuesta.toLowerCase() === q.respuesta.toLowerCase()) {
                puntaje++;
            }
        });
        quizContainer.innerHTML = `¡Obtuviste ${puntaje}/${preguntas.length}! 🚀`;
    };
    quizContainer.appendChild(button);
}

// Últimos Bugs Detectados
function mostrarBugs() {
    const bugs = [
        "Error de carga en Safari v15 – Solucionado ✅",
        "Problema de autenticación en Firefox – En progreso 🔄",
        "Fallo en la API de pagos – Solucionado ✅",
    ];
    const bugsList = document.getElementById('bugs-list');
    let index = 0;
    setInterval(() => {
        bugsList.innerHTML = `<p>${bugs[index]}</p>`;
        index = (index + 1) % bugs.length;
    }, 10000);
}

// Función para generar recomendaciones aleatorias
function generarRecomendaciones() {
    const lista = document.getElementById('recomendaciones-list');
    lista.innerHTML = '<li class="loading">Cargando recomendaciones...</li>'; // Mensaje de carga

    fetch('/recomendaciones')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las recomendaciones.');
            }
            return response.json();
        })
        .then(recomendaciones => {
            lista.innerHTML = ''; // Limpia las recomendaciones previas
            recomendaciones.forEach((recomendacion, index) => {
                const li = document.createElement('li');
                li.classList.add('recomendacion-item'); // Clase para estilos
                li.innerHTML = `
                    <div class="recomendacion-index">${index + 1}</div>
                    <div class="recomendacion-text">${recomendacion}</div>
                `;
                lista.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error generando recomendaciones:', error);
            lista.innerHTML = '<li class="error">Error al obtener las recomendaciones.</li>';
        });
}

// Función para generar recomendaciones con paginación
function generarRecomendacionesPaginadas(pagina = 1) {
    const lista = document.getElementById('recomendaciones-list');
    lista.innerHTML = '<li>Cargando recomendaciones...</li>'; // Mensaje de carga

    fetch(`/recomendaciones?pagina=${pagina}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las recomendaciones.');
            }
            return response.json();
        })
        .then(data => {
            const { recomendaciones, totalPaginas } = data;
            lista.innerHTML = ''; // Limpia las recomendaciones previas
            recomendaciones.forEach(recomendacion => {
                const li = document.createElement('li');
                li.textContent = recomendacion;
                lista.appendChild(li);
            });

            // Actualizar controles de paginación
            const paginacion = document.getElementById('paginacion');
            paginacion.innerHTML = `
                <button ${pagina === 1 ? 'disabled' : ''} onclick="generarRecomendacionesPaginadas(${pagina - 1})">Anterior</button>
                <span>Página ${pagina} de ${totalPaginas}</span>
                <button ${pagina === totalPaginas ? 'disabled' : ''} onclick="generarRecomendacionesPaginadas(${pagina + 1})">Siguiente</button>
            `;
        })
        .catch(error => {
            console.error('Error generando recomendaciones:', error);
            lista.innerHTML = '<li>Error al obtener las recomendaciones.</li>';
        });
}

// Función para buscar recomendaciones
function buscarRecomendaciones() {
    const query = document.getElementById('busqueda-recomendaciones').value.trim();
    const lista = document.getElementById('recomendaciones-list');
    lista.innerHTML = '<li>Cargando resultados...</li>'; // Mensaje de carga

    fetch(`/recomendaciones?query=${encodeURIComponent(query)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al buscar recomendaciones.');
            }
            return response.json();
        })
        .then(recomendaciones => {
            lista.innerHTML = ''; // Limpia las recomendaciones previas
            if (recomendaciones.length === 0) {
                lista.innerHTML = '<li>No se encontraron resultados.</li>';
            } else {
                recomendaciones.forEach(recomendacion => {
                    const li = document.createElement('li');
                    li.textContent = recomendacion;
                    lista.appendChild(li);
                });
            }
        })
        .catch(error => {
            console.error('Error buscando recomendaciones:', error);
            lista.innerHTML = '<li>Error al buscar recomendaciones.</li>';
        });
}

// Simulador de Pruebas de Carga
function simularCarga(event) {
    event.preventDefault();
    const usuarios = parseInt(document.getElementById('usuarios').value, 10);
    const duracion = parseInt(document.getElementById('duracion').value, 10);
    const resultado = document.getElementById('resultado-carga');

    resultado.innerHTML = '<p>Simulando carga...</p>';

    setTimeout(() => {
        resultado.innerHTML = `
            <p>Simulación completada:</p>
            <ul>
                <li><strong>Usuarios Simulados:</strong> ${usuarios}</li>
                <li><strong>Duración:</strong> ${duracion} segundos</li>
                <li><strong>Tiempo de Respuesta Promedio:</strong> ${Math.random().toFixed(2)} segundos</li>
                <li><strong>Errores Detectados:</strong> ${Math.floor(Math.random() * 10)}</li>
            </ul>
        `;
    }, duracion * 1000);
}

// Generador de Datos de Prueba
function generarDatosPrueba(event) {
    event.preventDefault();
    const tipoDato = document.getElementById('tipo-dato').value;
    const cantidad = parseInt(document.getElementById('cantidad-datos').value, 10);
    const lista = document.getElementById('lista-datos-prueba');

    lista.innerHTML = '<li>Generando datos...</li>';

    setTimeout(() => {
        lista.innerHTML = '';
        for (let i = 0; i < cantidad; i++) {
            const li = document.createElement('li');
            li.textContent = generarDato(tipoDato);
            lista.appendChild(li);
        }
    }, 1000);
}

function generarDato(tipo) {
    const nombres = ['Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Sofía', 'Pedro', 'Lucía'];
    const apellidos = ['Gómez', 'Pérez', 'Rodríguez', 'López', 'Martínez', 'Hernández', 'García', 'Fernández'];
    const dominios = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const calles = ['Av. Principal', 'Calle Secundaria', 'Paseo del Sol', 'Camino Real', 'Boulevard Central'];
    const ciudades = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'];

    switch (tipo) {
        case 'nombre':
            const nombre = nombres[Math.floor(Math.random() * nombres.length)];
            const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
            return `${nombre} ${apellido}`;
        case 'email':
            const usuario = nombres[Math.floor(Math.random() * nombres.length)].toLowerCase();
            const dominio = dominios[Math.floor(Math.random() * dominios.length)];
            return `${usuario}${Math.floor(Math.random() * 1000)}@${dominio}`;
        case 'telefono':
            const prefijo = '+57';
            const numero = Math.floor(Math.random() * 900000000) + 100000000; // Genera un número de 9 dígitos
            return `${prefijo} ${numero}`;
        case 'direccion':
            const calle = calles[Math.floor(Math.random() * calles.length)];
            const numeroCalle = Math.floor(Math.random() * 100) + 1;
            const ciudad = ciudades[Math.floor(Math.random() * ciudades.length)];
            return `${calle} #${numeroCalle}, ${ciudad}`;
        default:
            return 'Dato desconocido';
    }
}

// Mostrar Métricas de Calidad
function mostrarMetricas() {
    const metricas = [
        { nombre: 'Cobertura de Pruebas', valor: `${Math.floor(Math.random() * 16) + 80}%` }, // 80% - 95%
        { nombre: 'Defectos por Módulo', valor: `${Math.floor(Math.random() * 5) + 1}` }, // 1 - 5
        { nombre: 'Tiempo Promedio de Resolución', valor: `${Math.floor(Math.random() * 3) + 1} días` }, // 1 - 3 días
        { nombre: 'Tasa de Éxito de Automatización', valor: `${Math.floor(Math.random() * 6) + 90}%` } // 90% - 95%
    ];

    const contenedor = document.getElementById('metricas-calidad');
    contenedor.innerHTML = '<p>Cargando métricas...</p>';

    setTimeout(() => {
        contenedor.innerHTML = '<ul>' + metricas.map(m => `<li><strong>${m.nombre}:</strong> ${m.valor}</li>`).join('') + '</ul>';
    }, 1000);
}

// Llama a las funciones al cargar la página
if (document.getElementById('admin-image-list')) loadAdminImages();
if (document.getElementById('admin-video-list')) loadAdminVideos();
if (document.getElementById('youtube-links-list')) loadYoutubeLinks();
mostrarBugs();

document.getElementById('herramientas-list')?.addEventListener('change', function(event) {
    // Reemplaza referencias a 'services-list'
});
