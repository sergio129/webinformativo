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
document.getElementById('roi-form')?.addEventListener('submit', event => {
    event.preventDefault();

    const errores = parseInt(document.getElementById('errores').value, 10);
    const horas = parseInt(document.getElementById('horas').value, 10);
    const costoHora = parseInt(document.getElementById('costo-hora').value, 10);

    if (isNaN(errores) || isNaN(horas) || isNaN(costoHora)) {
        alert('Por favor, ingresa valores válidos en todos los campos.');
        return;
    }

    // Fórmula mejorada para calcular el ROI
    const ahorroPorErrores = errores * 100000; // Cada error evitado ahorra 100,000 COP
    const ahorroPorHoras = horas * costoHora; // Ahorro basado en el costo por hora
    const roiTotal = ahorroPorErrores + ahorroPorHoras;

    // Formatear el resultado en pesos colombianos
    const formatoCOP = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
    });

    const resultadoDiv = document.getElementById('resultado-roi');
    resultadoDiv.innerHTML = `
        <p><strong>Resultados del ROI:</strong></p>
        <ul>
            <li>Ahorro por errores evitados: ${formatoCOP.format(ahorroPorErrores)}</li>
            <li>Ahorro por horas ahorradas: ${formatoCOP.format(ahorroPorHoras)}</li>
            <li><strong>ROI Total Estimado: ${formatoCOP.format(roiTotal)}</strong></li>
        </ul>
    `;
});

// Demo de Herramientas de Testing
document.getElementById('test-automation-btn')?.addEventListener('click', () => {
    const consola = document.getElementById('consola-testing');
    consola.textContent = ''; // Limpia la consola antes de iniciar la simulación

    const pasos = [
        'Inicializando entorno de pruebas...',
        'Cargando casos de prueba...',
        'Ejecutando pruebas funcionales...',
        'Ejecutando pruebas de rendimiento...',
        'Ejecutando pruebas de seguridad...',
        'Generando reporte de resultados...'
    ];

    let pasoActual = 0;

    const intervalo = setInterval(() => {
        if (pasoActual < pasos.length) {
            consola.textContent += `${pasos[pasoActual]}\n`;
            pasoActual++;
        } else {
            clearInterval(intervalo);

            // Generar datos aleatorios para el resumen
            const totalCasos = Math.floor(Math.random() * 100) + 50; // Entre 50 y 150
            const casosExitosos = Math.floor(Math.random() * totalCasos * 0.9); // Hasta el 90% exitosos
            const casosFallidos = totalCasos - casosExitosos;
            const tiempoTotal = Math.floor(Math.random() * 30) + 10; // Entre 10 y 40 segundos

            consola.textContent += '\nPruebas completadas exitosamente.\n';
            consola.textContent += 'Resumen:\n';
            consola.textContent += `- Casos de prueba ejecutados: ${totalCasos}\n`;
            consola.textContent += `- Casos exitosos: ${casosExitosos}\n`;
            consola.textContent += `- Casos fallidos: ${casosFallidos}\n`;
            consola.textContent += `- Tiempo total: ${tiempoTotal} segundos\n`;
        }
    }, 2000); // Simula un retraso de 2 segundos entre cada paso
});

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

// Analizador de Logs
document.getElementById('log-analyzer-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const logFile = document.getElementById('log-file').files[0];
    const resultDiv = document.getElementById('log-analysis-result');
    resultDiv.innerHTML = '<p class="loading">Analizando logs...</p>';

    const formData = new FormData();
    formData.append('logFile', logFile);

    try {
        const response = await fetch('/api/analyze-logs', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al analizar los logs.');
        }

        const analysisResult = await response.json();
        resultDiv.innerHTML = `<pre>${JSON.stringify(analysisResult, null, 2)}</pre>`;
    } catch (error) {
        console.error('Error al analizar logs:', error);
        resultDiv.innerHTML = '<p class="error">Error al analizar los logs. Intenta nuevamente.</p>';
    }
});

// Simulador de Errores HTTP
document.getElementById('http-error-simulator-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const errorCode = parseInt(document.getElementById('http-error-code').value, 10);
    const resultDiv = document.getElementById('http-error-result');

    // Validar que el código sea un error HTTP válido (4xx o 5xx)
    if (errorCode < 400 || errorCode > 599) {
        resultDiv.innerHTML = '<p class="error">Por favor, ingresa un código de error HTTP válido (4xx o 5xx).</p>';
        return;
    }

    resultDiv.innerHTML = `<p class="error">Simulando error HTTP ${errorCode}: ${getHttpErrorMessage(errorCode)}</p>`;
});

function getHttpErrorMessage(code) {
    const errors = {
        400: 'Solicitud incorrecta',
        401: 'No autorizado',
        403: 'Prohibido',
        404: 'No encontrado',
        500: 'Error interno del servidor',
        502: 'Bad Gateway',
        503: 'Servicio no disponible'
    };
    return errors[code] || 'Error HTTP genérico';
}

// Simulador de Respuestas HTTP
document.getElementById('http-response-simulator-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const responseCode = parseInt(document.getElementById('http-response-code').value, 10);
    const resultDiv = document.getElementById('http-response-result');

    const responseTypes = {
        informational: 'Respuesta Informativa (1xx)',
        success: 'Éxito (2xx)',
        redirection: 'Redirección (3xx)',
        clientError: 'Error del Cliente (4xx)',
        serverError: 'Error del Servidor (5xx)',
    };

    let responseType;

    if (responseCode >= 100 && responseCode < 200) {
        responseType = responseTypes.informational;
    } else if (responseCode >= 200 && responseCode < 300) {
        responseType = responseTypes.success;
    } else if (responseCode >= 300 && responseCode < 400) {
        responseType = responseTypes.redirection;
    } else if (responseCode >= 400 && responseCode < 500) {
        responseType = responseTypes.clientError;
    } else if (responseCode >= 500 && responseCode < 600) {
        responseType = responseTypes.serverError;
    } else {
        responseType = 'Código no válido. Por favor, ingresa un código HTTP entre 100 y 599.';
    }

    resultDiv.innerHTML = `<p><strong>Código:</strong> ${responseCode}</p><p><strong>Tipo:</strong> ${responseType}</p>`;
});

// Generador de Contraseñas
document.getElementById('password-generator-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const length = parseInt(document.getElementById('password-length').value, 10);
    const includeSymbols = document.getElementById('include-symbols').checked;
    const includeNumbers = document.getElementById('include-numbers').checked;
    const includeUppercase = document.getElementById('include-uppercase').checked;

    const resultDiv = document.getElementById('password-result');
    resultDiv.innerHTML = `<p>Contraseña Generada: <strong>${generatePassword(length, includeSymbols, includeNumbers, includeUppercase)}</strong></p>`;
});

function generatePassword(length, includeSymbols, includeNumbers, includeUppercase) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';

    let characters = lowercase;
    if (includeSymbols) characters += symbols;
    if (includeNumbers) characters += numbers;
    if (includeUppercase) characters += uppercase;

    let password = '';
    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}

// Analizador de Logs
function analizarLogs(event) {
    event.preventDefault();
    const logFile = document.getElementById('log-file').files[0];
    const resultado = document.getElementById('resultado-logs');

    if (!logFile) {
        resultado.innerHTML = '<p>Por favor, selecciona un archivo de log.</p>';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const logs = e.target.result.split('\n');
        const errores = logs.filter(line => line.toLowerCase().includes('error'));
        resultado.innerHTML = `
            <p>Archivo analizado:</p>
            <ul>
                <li><strong>Total de líneas:</strong> ${logs.length}</li>
                <li><strong>Errores encontrados:</strong> ${errores.length}</li>
            </ul>
            <p>Primeros 5 errores:</p>
            <ul>${errores.slice(0, 5).map(error => `<li>${error}</li>`).join('')}</ul>
        `;
    };
    reader.readAsText(logFile);
}

// Generador de Datos de Carga
function generarDatosCarga(event) {
    event.preventDefault();
    const tipoDato = document.getElementById('tipo-dato-carga').value;
    const cantidad = parseInt(document.getElementById('cantidad-datos-carga').value, 10);
    const lista = document.getElementById('lista-datos-carga');

    lista.innerHTML = '<li>Generando datos...</li>';

    setTimeout(() => {
        lista.innerHTML = '';
        for (let i = 0; i < cantidad; i++) {
            const li = document.createElement('li');
            li.textContent = generarDatoCarga(tipoDato, i + 1);
            lista.appendChild(li);
        }
    }, 1000);
}

function generarDatoCarga(tipo, index) {
    switch (tipo) {
        case 'usuarios':
            return `Usuario${index}: usuario${index}@ejemplo.com`;
        case 'transacciones':
            return `Transacción${index}: $${(Math.random() * 1000).toFixed(2)}`;
        case 'productos':
            return `Producto${index}: Producto-${Math.random().toString(36).substring(7)}`;
        default:
            return 'Dato desconocido';
    }
}

// Validador de Accesibilidad
async function validarAccesibilidad(event) {
    event.preventDefault();
    const url = document.getElementById('url-accesibilidad').value;
    const resultado = document.getElementById('resultado-accesibilidad');

    resultado.innerHTML = '<p>Validando accesibilidad...</p>';

    try {
        const response = await fetch(`/api/accesibilidad?url=${encodeURIComponent(url)}`);
        if (!response.ok) {
            throw new Error('Error al validar la accesibilidad.');
        }
        const data = await response.json();
        resultado.innerHTML = `
            <p>Resultados de la validación para <strong>${url}</strong>:</p>
            <ul>
                <li><strong>Contraste de colores:</strong> ${data.contraste}</li>
                <li><strong>Etiquetas ARIA:</strong> ${data.etiquetasARIA}</li>
                <li><strong>Texto alternativo en imágenes:</strong> ${data.textoAlt}</li>
                <li><strong>Navegación por teclado:</strong> ${data.navegacionTeclado}</li>
            </ul>
        `;
    } catch (error) {
        resultado.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

// Simulador de Pruebas de API
async function simularPruebasAPI(event) {
    event.preventDefault();
    const url = document.getElementById('url-api').value;
    const metodo = document.getElementById('metodo-api').value;
    const bodyInput = document.getElementById('body-api').value;
    const resultado = document.getElementById('api-response');

    resultado.innerHTML = '<p>Ejecutando prueba de API...</p>';

    let body = null;

    // Validar y parsear el JSON del cuerpo de la solicitud
    if (bodyInput.trim() && metodo !== 'GET' && metodo !== 'DELETE') {
        try {
            body = JSON.parse(bodyInput);
        } catch (error) {
            resultado.innerHTML = `
                <h4>Error al probar la API:</h4>
                <pre>El cuerpo de la solicitud no es un JSON válido. Verifica el formato.</pre>
            `;
            return;
        }
    }

    try {
        const response = await fetch('/api/probar-api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, metodo, body })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData, null, 2));
        }

        const data = await response.json();
        resultado.innerHTML = `
            <h4>Estado: ${data.status}</h4>
            <h4>Encabezados:</h4>
            <pre>${JSON.stringify(data.headers, null, 2)}</pre>
            <h4>Datos:</h4>
            <pre>${JSON.stringify(data.data, null, 2)}</pre>
        `;
    } catch (error) {
        resultado.innerHTML = `
            <h4>Error al probar la API:</h4>
            <pre>${error.message}</pre>
        `;
    }
}

// Generador de Reportes
function generarReporte() {
    const resultado = document.getElementById('reporte-descarga');
    resultado.innerHTML = '<p>Generando reporte...</p>';

    fetch('/api/generar-reporte', { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al generar el reporte.');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const enlace = document.createElement('a');
            enlace.href = url;
            enlace.download = 'reporte.pdf';
            enlace.textContent = 'Descargar Reporte';
            resultado.innerHTML = '';
            resultado.appendChild(enlace);
        })
        .catch(error => {
            resultado.innerHTML = `<p>Error: ${error.message}</p>`;
        });
}

// Comparador de Archivos
function compararArchivos(event) {
    event.preventDefault();
    const archivo1 = document.getElementById('archivo1').files[0];
    const archivo2 = document.getElementById('archivo2').files[0];
    const resultado = document.getElementById('resultado-comparacion');

    if (!archivo1 || !archivo2) {
        resultado.innerHTML = '<p>Por favor, selecciona ambos archivos.</p>';
        return;
    }

    const formData = new FormData();
    formData.append('archivo1', archivo1);
    formData.append('archivo2', archivo2);

    resultado.innerHTML = '<p>Comparando archivos...</p>';

    fetch('/api/comparar-archivos', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al comparar los archivos.');
            }
            return response.json();
        })
        .then(data => {
            resultado.innerHTML = `
                <h4>Resultado de la Comparación:</h4>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            `;
        })
        .catch(error => {
            resultado.innerHTML = `<p>Error: ${error.message}</p>`;
        });
}

// Validador de Esquemas JSON
document.getElementById('json-schema-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const jsonInput = document.getElementById('json-input').value;
    const jsonSchema = document.getElementById('json-schema').value;
    const resultDiv = document.getElementById('json-schema-result');

    try {
        const parsedJson = JSON.parse(jsonInput);
        const parsedSchema = JSON.parse(jsonSchema);

        // Validar JSON contra el esquema
        const ajv = new Ajv(); // Asegúrate de incluir la librería Ajv en tu proyecto
        const validate = ajv.compile(parsedSchema);
        const valid = validate(parsedJson);

        if (valid) {
            resultDiv.innerHTML = '<p class="success">El JSON es válido según el esquema proporcionado.</p>';
        } else {
            resultDiv.innerHTML = `<p class="error">Errores de validación:</p><ul>${validate.errors.map(err => `<li>${err.message}</li>`).join('')}</ul>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">Error al procesar el JSON o el esquema: ${error.message}</p>`;
    }
});

// Generador de Códigos de Respuesta
document.getElementById('mock-response-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const status = document.getElementById('mock-status').value;
    const body = document.getElementById('mock-body').value;
    const resultDiv = document.getElementById('mock-response-result');

    try {
        const parsedBody = JSON.parse(body);

        resultDiv.innerHTML = `
            <p><strong>Código de Estado:</strong> ${status}</p>
            <pre>${JSON.stringify(parsedBody, null, 2)}</pre>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">Error al procesar el cuerpo de la respuesta: ${error.message}</p>`;
    }
});

// Navegación entre pestañas
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Desactivar todas las pestañas y botones
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Activar la pestaña seleccionada
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
});

// Generador de Recomendaciones QA
document.getElementById('qa-recommendations-btn')?.addEventListener('click', async () => {
    const recommendationsList = document.getElementById('qa-recommendations-list');
    recommendationsList.innerHTML = '<li class="loading">Cargando recomendaciones...</li>';

    try {
        const response = await fetch('/recomendaciones', { method: 'GET' });

        if (!response.ok) {
            throw new Error('Error al obtener las recomendaciones.');
        }

        const recommendations = await response.json();
        recommendationsList.innerHTML = recommendations.map(rec => `<li>${rec}</li>`).join('');
    } catch (error) {
        console.error('Error al cargar recomendaciones:', error);
        recommendationsList.innerHTML = '<li class="error">Error al cargar recomendaciones. Intenta nuevamente.</li>';
    }
});

// Inicializar pestañas al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const defaultTab = document.querySelector('.tab-button.active');
    if (defaultTab) {
        defaultTab.click();
    }
});

// Llama a las funciones al cargar la página
if (document.getElementById('admin-image-list')) loadAdminImages();
if (document.getElementById('admin-video-list')) loadAdminVideos();
if (document.getElementById('youtube-links-list')) loadYoutubeLinks();
mostrarBugs();

document.getElementById('herramientas-list')?.addEventListener('change', function(event) {
    // Reemplaza referencias a 'services-list'
});

document.addEventListener('DOMContentLoaded', () => {
    // Cambiar entre pestañas
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            button.classList.add('active');
        });
    });

    // Calculadora de ROI
    document.getElementById('roi-form')?.addEventListener('submit', event => {
        event.preventDefault();
        const errores = parseInt(document.getElementById('errores').value, 10);
        const horas = parseInt(document.getElementById('horas').value, 10);
        const roi = errores * horas * 10; // Fórmula de ejemplo
        document.getElementById('resultado-roi').textContent = `ROI estimado: $${roi}`;
    });

    // Demo de Herramientas de Testing
    document.getElementById('test-automation-btn')?.addEventListener('click', () => {
        const consola = document.getElementById('consola-testing');
        consola.textContent = 'Ejecutando pruebas automatizadas...\n';
        setTimeout(() => {
            consola.textContent += 'Pruebas completadas exitosamente.';
        }, 2000);
    });

    // Generador Automático de Casos de Prueba
    document.getElementById('test-case-form')?.addEventListener('submit', event => {
        event.preventDefault();
        const nombreApp = document.getElementById('nombre-app').value;
        const numeroCasos = parseInt(document.getElementById('numero-casos').value, 10);
        const contenedorCasos = document.getElementById('contenedor-casos');
        contenedorCasos.innerHTML = '';
        for (let i = 1; i <= numeroCasos; i++) {
            const caso = document.createElement('div');
            caso.className = 'caso-prueba';
            caso.textContent = `Caso ${i}: Prueba funcionalidad de ${nombreApp}`;
            contenedorCasos.appendChild(caso);
        }
        document.getElementById('modal-casos').style.display = 'block';
    });

    // Cerrar modal de casos de prueba
    window.cerrarModalCasos = () => {
        document.getElementById('modal-casos').style.display = 'none';
    };
});
