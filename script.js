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

// Función para mostrar notificaciones toast en lugar de alertas
function mostrarToast(mensaje, tipo = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fa ${tipo === 'success' ? 'fa-check-circle' : tipo === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <div class="toast-message">${mensaje}</div>
        </div>
        <i class="fa fa-times toast-close"></i>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    const autoClose = setTimeout(() => {
        cerrarToast(toast);
    }, 5000);

    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', () => {
        clearTimeout(autoClose);
        cerrarToast(toast);
    });
}

function cerrarToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 300);
}

document.getElementById('carousel-upload')?.addEventListener('change', function(event) {
    const previewContainer = document.getElementById('admin-preview') || document.querySelector('.carousel-images');
    previewContainer.innerHTML = ''; // Limpia las imágenes existentes

    const files = Array.from(event.target.files);

    if (files.length === 0) {
        mostrarToast('Por favor, selecciona al menos una imagen.', 'error');
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
            mostrarToast('Solo se permiten archivos de imagen.', 'error');
        }
    });

    if (previewContainer.classList.contains('carousel-images')) {
        currentIndex = 0;
    }
});

let currentIndex = 0;

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

    fetch('/imagenes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las imágenes.');
            }
            return response.json();
        })
        .then(images => {
            console.log('Imágenes obtenidas del servidor:', images);

            if (images.length === 0) {
                console.warn('No hay imágenes disponibles en la carpeta.');
                return;
            }

            images.forEach(image => {
                const imagePath = `/imagenes/${image}`;
                console.log('Ruta de la imagen:', imagePath);

                const img = document.createElement('img');
                img.src = imagePath;
                img.alt = `Imagen del carrusel: ${image}`;
                carouselContainer.appendChild(img);
            });

            currentIndex = 0;
        })
        .catch(error => console.error('Error cargando imágenes:', error));
}

loadCarouselImages();

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
                            loadAdminImages();
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
                            loadAdminVideos();
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

if (document.getElementById('admin-video-list')) loadAdminVideos();

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
                            loadYoutubeLinks();
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

document.getElementById('roi-form')?.addEventListener('submit', event => {
    event.preventDefault();

    const errores = parseInt(document.getElementById('errores').value, 10);
    const horas = parseInt(document.getElementById('horas').value, 10);
    const costoHora = parseInt(document.getElementById('costo-hora').value, 10);

    if (isNaN(errores) || isNaN(horas) || isNaN(costoHora)) {
        mostrarToast('Por favor, ingresa valores válidos en todos los campos.', 'error');
        return;
    }

    const ahorroPorErrores = errores * 100000;
    const ahorroPorHoras = horas * costoHora;
    const roiTotal = ahorroPorErrores + ahorroPorHoras;

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

document.getElementById('test-automation-btn')?.addEventListener('click', () => {
    const consola = document.getElementById('consola-testing');
    consola.innerHTML = '';

    const mensajes = [
        { text: 'Ejecutando pruebas automatizadas...', class: 'info' },
        { text: 'Inicializando entorno de pruebas...', class: 'info' },
        { text: 'Cargando casos de prueba...', class: 'info' },
        { text: 'Ejecutando pruebas funcionales...', class: 'info' },
        { text: 'Ejecutando pruebas de rendimiento...', class: 'info' },
        { text: 'Ejecutando pruebas de seguridad...', class: 'info' },
        { text: 'Generando reporte de resultados...', class: 'info' },
        { text: 'Pruebas completadas exitosamente.', class: 'success' },
        { text: 'Resumen:', class: 'info' },
        { text: '- Casos de prueba ejecutados: 106', class: 'info' },
        { text: '- Casos exitosos: 60', class: 'success' },
        { text: '- Casos fallidos: 46', class: 'error' },
        { text: '- Tiempo total: 25 segundos', class: 'info' }
    ];

    let delay = 0;

    mensajes.forEach((mensaje) => {
        setTimeout(() => {
            const line = document.createElement('div');
            line.className = `line ${mensaje.class}`;
            line.textContent = mensaje.text;
            consola.appendChild(line);
            consola.scrollTop = consola.scrollHeight;
        }, delay);
        delay += 1000;
    });
});

let casosGenerados = [];

function generarCasos(event) {
    event.preventDefault();
    const nombreApp = document.getElementById('nombre-app').value.trim();
    const numeroCasos = parseInt(document.getElementById('numero-casos').value.trim(), 10);

    if (!nombreApp || isNaN(numeroCasos) || numeroCasos <= 0) {
        mostrarToast('Por favor, ingresa un nombre de la aplicación válido y un número de casos mayor a 0.', 'error');
        return;
    }

    casosGenerados = generarCasosDePrueba(nombreApp, numeroCasos);
    mostrarCasosEnModal();
}

function generarCasosDePrueba(nombreApp, numeroCasos) {
    const casos = [];
    for (let i = 1; i <= numeroCasos; i++) {
        casos.push({
            id: `CP-${i.toString().padStart(3, '0')}`,
            nombre: `Caso de Prueba ${i} para ${nombreApp}`,
            descripcion: `Este caso de prueba valida la funcionalidad ${i} en la aplicación ${nombreApp}.`,
            resultadoEsperado: `La funcionalidad ${i} debe comportarse según los requisitos establecidos en ${nombreApp}.`
        });
    }
    return casos;
}

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

    contenedorCasos.innerHTML = '';

    if (casosGenerados.length === 0) {
        contenedorCasos.innerHTML = '<p>No hay casos de prueba generados. Por favor, genera algunos primero.</p>';
    } else {
        const table = document.createElement('table');
        table.classList.add('casos-table');

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

    modal.style.display = 'block';
}

function cerrarModalCasos() {
    const modal = document.getElementById('modal-casos');
    if (modal) {
        modal.style.display = 'none';
    }
}

function abrirQuiz() {
    document.getElementById('quiz-modal').style.display = 'block';
    iniciarQuiz();
}

function cerrarQuiz() {
    document.getElementById('quiz-modal').style.display = 'none';
}

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
    quizContainer.innerHTML = '';
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

function generarRecomendaciones() {
    const lista = document.getElementById('recomendaciones-list');
    lista.innerHTML = '<li class="loading">Cargando recomendaciones...</li>';

    fetch('/recomendaciones')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las recomendaciones.');
            }
            return response.json();
        })
        .then(recomendaciones => {
            lista.innerHTML = '';
            recomendaciones.forEach((recomendacion, index) => {
                const li = document.createElement('li');
                li.classList.add('recomendacion-item');
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

function generarRecomendacionesPaginadas(pagina = 1) {
    const lista = document.getElementById('recomendaciones-list');
    lista.innerHTML = '<li>Cargando recomendaciones...</li>';

    fetch(`/recomendaciones?pagina=${pagina}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las recomendaciones.');
            }
            return response.json();
        })
        .then(data => {
            const { recomendaciones, totalPaginas } = data;
            lista.innerHTML = '';
            recomendaciones.forEach(recomendacion => {
                const li = document.createElement('li');
                li.textContent = recomendacion;
                lista.appendChild(li);
            });

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

function buscarRecomendaciones() {
    const query = document.getElementById('busqueda-recomendaciones').value.trim();
    const lista = document.getElementById('recomendaciones-list');
    lista.innerHTML = '<li>Cargando resultados...</li>';

    fetch(`/recomendaciones?query=${encodeURIComponent(query)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al buscar recomendaciones.');
            }
            return response.json();
        })
        .then(recomendaciones => {
            lista.innerHTML = '';
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
            const numero = Math.floor(Math.random() * 900000000) + 100000000;
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

function mostrarMetricas() {
    const metricas = [
        { nombre: 'Cobertura de Pruebas', valor: `${Math.floor(Math.random() * 16) + 80}%` },
        { nombre: 'Defectos por Módulo', valor: `${Math.floor(Math.random() * 5) + 1}` },
        { nombre: 'Tiempo Promedio de Resolución', valor: `${Math.floor(Math.random() * 3) + 1} días` },
        { nombre: 'Tasa de Éxito de Automatización', valor: `${Math.floor(Math.random() * 6) + 90}%` }
    ];

    const contenedor = document.getElementById('metricas-calidad');
    contenedor.innerHTML = '<p>Cargando métricas...</p>';

    setTimeout(() => {
        contenedor.innerHTML = '<ul>' + metricas.map(m => `<li><strong>${m.nombre}:</strong> ${m.valor}</li>`).join('') + '</ul>';
    }, 1000);
}

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

document.getElementById('http-error-simulator-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const errorCode = parseInt(document.getElementById('http-error-code').value, 10);
    const resultDiv = document.getElementById('http-error-result');

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

async function simularPruebasAPI(event) {
    event.preventDefault();
    const url = document.getElementById('url-api').value;
    const metodo = document.getElementById('metodo-api').value;
    const bodyInput = document.getElementById('body-api').value;
    const resultado = document.getElementById('api-response');

    resultado.innerHTML = '<p>Ejecutando prueba de API...</p>';

    let body = null;

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

document.getElementById('json-schema-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const jsonInput = document.getElementById('json-input').value;
    const jsonSchema = document.getElementById('json-schema').value;
    const resultDiv = document.getElementById('json-schema-result');

    try {
        const parsedJson = JSON.parse(jsonInput);
        const parsedSchema = JSON.parse(jsonSchema);

        const ajv = new Ajv();
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

document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
});

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

document.addEventListener('DOMContentLoaded', () => {
    const defaultTab = document.querySelector('.tab-button.active');
    if (defaultTab) {
        defaultTab.click();
    }
});

document.getElementById('currency-converter-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('from-currency').value.toUpperCase();
    const toCurrency = document.getElementById('to-currency').value.toUpperCase();
    const resultDiv = document.getElementById('currency-converter-result');

    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        if (!response.ok) throw new Error('Error al obtener las tasas de cambio.');

        const data = await response.json();
        const rate = data.rates[toCurrency];
        if (!rate) throw new Error('Moneda no válida.');

        const convertedAmount = (amount * rate).toFixed(2);
        resultDiv.innerHTML = `<p>${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}</p>`;
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">${error.message}</p>`;
    }
});

document.getElementById('qr-generator-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const text = document.getElementById('qr-text').value;
    const resultDiv = document.getElementById('qr-code-result');
    resultDiv.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=150x150" alt="QR Code">`;
});

document.getElementById('bmi-calculator-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const resultDiv = document.getElementById('bmi-result');

    if (weight > 0 && height > 0) {
        const bmi = (weight / (height * height)).toFixed(2);
        resultDiv.innerHTML = `<p>Tu IMC es: ${bmi}</p>`;
    } else {
        resultDiv.innerHTML = '<p class="error">Por favor, ingresa valores válidos.</p>';
    }
});

document.getElementById('lorem-ipsum-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const paragraphs = parseInt(document.getElementById('paragraphs').value, 10);
    const resultDiv = document.getElementById('lorem-ipsum-result');
    const loremText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

    resultDiv.innerHTML = Array(paragraphs).fill(`<p>${loremText}</p>`).join('');
});

document.getElementById('age-calculator-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const birthdate = new Date(document.getElementById('birthdate').value);
    const today = new Date();
    const resultDiv = document.getElementById('age-result');

    if (birthdate > today) {
        resultDiv.innerHTML = '<p class="error">La fecha de nacimiento no puede ser en el futuro.</p>';
        return;
    }

    const age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    const dayDiff = today.getDate() - birthdate.getDate();

    const exactAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
    resultDiv.innerHTML = `<p>Tu edad es: ${exactAge} años</p>`;
});

document.getElementById('random-word-generator-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const wordCount = parseInt(document.getElementById('word-count').value, 10);
    const resultList = document.getElementById('random-word-result');
    const words = ['código', 'prueba', 'software', 'automatización', 'calidad', 'desarrollo', 'sistema', 'usuario', 'interfaz', 'rendimiento'];

    resultList.innerHTML = '';
    for (let i = 0; i < wordCount; i++) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        const listItem = document.createElement('li');
        listItem.textContent = randomWord;
        resultList.appendChild(listItem);
    }
});

document.getElementById('compound-interest-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const principal = parseFloat(document.getElementById('principal').value);
    const rate = parseFloat(document.getElementById('rate').value) / 100;
    const time = parseFloat(document.getElementById('time').value);
    const frequency = parseInt(document.getElementById('frequency').value, 10);
    const resultDiv = document.getElementById('compound-interest-result');

    const amount = principal * Math.pow(1 + rate / frequency, frequency * time);
    resultDiv.innerHTML = `<p>Monto Total: ${amount.toFixed(2)} COP</p>`;
});

document.getElementById('random-number-generator-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const min = parseInt(document.getElementById('min-number').value, 10);
    const max = parseInt(document.getElementById('max-number').value, 10);
    const resultDiv = document.getElementById('random-number-result');

    if (min > max) {
        resultDiv.innerHTML = '<p class="error">El valor mínimo no puede ser mayor que el máximo.</p>';
        return;
    }

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    resultDiv.innerHTML = `<p>Número Generado: ${randomNumber}</p>`;
});

let stopwatchInterval;
let stopwatchTime = 0;

document.getElementById('start-stopwatch')?.addEventListener('click', () => {
    if (!stopwatchInterval) {
        stopwatchInterval = setInterval(() => {
            stopwatchTime++;
            const hours = String(Math.floor(stopwatchTime / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((stopwatchTime % 3600) / 60)).padStart(2, '0');
            const seconds = String(stopwatchTime % 60).padStart(2, '0');
            document.getElementById('stopwatch-display').textContent = `${hours}:${minutes}:${seconds}`;
        }, 1000);
    }
});

document.getElementById('pause-stopwatch')?.addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
});

document.getElementById('reset-stopwatch')?.addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    stopwatchTime = 0;
    document.getElementById('stopwatch-display').textContent = '00:00:00';
});

let timerInterval;

document.getElementById('timer-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const minutes = parseInt(document.getElementById('timer-minutes').value, 10);
    const resultDiv = document.getElementById('timer-display');
    let remainingTime = minutes * 60;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            resultDiv.innerHTML = '<p>¡Tiempo terminado!</p>';
            return;
        }

        const mins = String(Math.floor(remainingTime / 60)).padStart(2, '0');
        const secs = String(remainingTime % 60).padStart(2, '0');
        resultDiv.innerHTML = `<p>${mins}:${secs}</p>`;
        remainingTime--;
    }, 1000);
});

document.getElementById('phone-number-generator-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const count = parseInt(document.getElementById('phone-count').value, 10);
    const resultList = document.getElementById('phone-number-result');
    resultList.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const phoneNumber = `+57 ${Math.floor(300000000 + Math.random() * 700000000)}`;
        const listItem = document.createElement('li');
        listItem.textContent = phoneNumber;
        resultList.appendChild(listItem);
    }
});

document.getElementById('email-generator-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const count = parseInt(document.getElementById('email-count').value, 10);
    const resultList = document.getElementById('email-result');
    const domains = ['example.com', 'test.com', 'demo.com'];
    resultList.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const email = `user${Math.floor(Math.random() * 10000)}@${domains[Math.floor(Math.random() * domains.length)]}`;
        const listItem = document.createElement('li');
        listItem.textContent = email;
        resultList.appendChild(listItem);
    }
});

document.getElementById('address-generator-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const count = parseInt(document.getElementById('address-count').value, 10);
    const resultList = document.getElementById('address-result');
    const streets = ['Calle 1', 'Avenida 2', 'Carrera 3', 'Diagonal 4', 'Transversal 5'];
    const cities = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'];
    resultList.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const address = `${streets[Math.floor(Math.random() * streets.length)]} #${Math.floor(Math.random() * 100)}-${Math.floor(Math.random() * 50)}, ${cities[Math.floor(Math.random() * cities.length)]}`;
        const listItem = document.createElement('li');
        listItem.textContent = address;
        resultList.appendChild(listItem);
    }
});

document.getElementById('date-generator-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const startDate = new Date(document.getElementById('start-date').value);
    const endDate = new Date(document.getElementById('end-date').value);
    const count = parseInt(document.getElementById('date-count').value, 10);
    const resultList = document.getElementById('date-result');
    resultList.innerHTML = '';

    if (startDate >= endDate) {
        resultList.innerHTML = '<p class="error">La fecha de inicio debe ser anterior a la fecha de fin.</p>';
        return;
    }

    for (let i = 0; i < count; i++) {
        const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
        const listItem = document.createElement('li');
        listItem.textContent = randomDate.toISOString().split('T')[0];
        resultList.appendChild(listItem);
    }
});

if (document.getElementById('admin-image-list')) loadAdminImages();
if (document.getElementById('admin-video-list')) loadAdminVideos();
if (document.getElementById('youtube-links-list')) loadYoutubeLinks();
mostrarBugs();

document.getElementById('herramientas-list')?.addEventListener('change', function(event) {
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            button.classList.add('active');
        });
    });

    document.getElementById('roi-form')?.addEventListener('submit', event => {
        event.preventDefault();
        const errores = parseInt(document.getElementById('errores').value, 10);
        const horas = parseInt(document.getElementById('horas').value, 10);
        const roi = errores * horas * 10;
        document.getElementById('resultado-roi').textContent = `ROI estimado: $${roi}`;
    });

    document.getElementById('test-automation-btn')?.addEventListener('click', () => {
        const consola = document.getElementById('consola-testing');
        consola.textContent = 'Ejecutando pruebas automatizadas...\n';
        setTimeout(() => {
            consola.textContent += 'Pruebas completadas exitosamente.';
        }, 2000);
    });

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

    window.cerrarModalCasos = () => {
        document.getElementById('modal-casos').style.display = 'none';
    };
});

function generarPlanPrueba(event) {
    event.preventDefault();
    const nombreProyecto = document.getElementById('nombre-proyecto').value.trim();
    const duracionSprint = parseInt(document.getElementById('duracion-sprint').value, 10);

    const resultado = document.getElementById('resultado-plan-prueba');
    resultado.innerHTML = '<p>Generando plan de pruebas...</p>';

    setTimeout(() => {
        const fases = [
            { nombre: 'Planificación', duracion: Math.round(duracionSprint * 0.2) },
            { nombre: 'Diseño de Casos', duracion: Math.round(duracionSprint * 0.3) },
            { nombre: 'Ejecución', duracion: Math.round(duracionSprint * 0.4) },
            { nombre: 'Reporte', duracion: Math.round(duracionSprint * 0.1) }
        ];

        const actividades = {
            'Planificación': ['Revisión de requisitos', 'Análisis de riesgos', 'Definición de estrategia'],
            'Diseño de Casos': ['Creación de casos de prueba', 'Revisión por pares', 'Preparación de datos'],
            'Ejecución': ['Pruebas funcionales', 'Pruebas de regresión', 'Reporte de defectos'],
            'Reporte': ['Análisis de resultados', 'Generación de informes', 'Retrospectiva']
        };

        let planHTML = `
            <h3>Plan de Pruebas para ${nombreProyecto}</h3>
            <p><strong>Duración Total:</strong> ${duracionSprint} días</p>
            <table class="plan-table">
                <thead>
                    <tr>
                        <th>Fase</th>
                        <th>Duración (días)</th>
                        <th>Actividades</th>
                    </tr>
                </thead>
                <tbody>
        `;

        fases.forEach(fase => {
            planHTML += `
                <tr>
                    <td>${fase.nombre}</td>
                    <td>${fase.duracion}</td>
                    <td><ul>${actividades[fase.nombre].map(act => `<li>${act}</li>`).join('')}</ul></td>
                </tr>
            `;
        });

        planHTML += `
                </tbody>
            </table>
            <button onclick="exportarPlanPrueba('${nombreProyecto}', ${duracionSprint})" class="btn-primary">Exportar Plan</button>
        `;

        const modalContenido = document.getElementById('contenedor-plan-prueba');
        modalContenido.innerHTML = planHTML;

        document.getElementById('modal-plan-prueba').style.display = 'block';

        resultado.innerHTML = '<p>Plan generado. Ver resultados en la ventana emergente.</p>';
    }, 1500);
}

function cerrarModalPlanPrueba() {
    document.getElementById('modal-plan-prueba').style.display = 'none';
}

function exportarPlanPrueba(nombreProyecto, duracionSprint) {
    mostrarToast(`El plan de pruebas para ${nombreProyecto} será descargado como PDF`, 'success');
}

function compararVersiones(event) {
    event.preventDefault();
    const version1 = document.getElementById('version1').value.trim();
    const version2 = document.getElementById('version2').value.trim();
    const resultado = document.getElementById('resultado-comparacion');

    resultado.innerHTML = '<p>Comparando versiones...</p>';

    setTimeout(() => {
        try {
            const v1Parts = version1.split('.').map(Number);
            const v2Parts = version2.split('.').map(Number);

            let comparacion;

            for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
                const p1 = i < v1Parts.length ? v1Parts[i] : 0;
                const p2 = i < v2Parts.length ? v2Parts[i] : 0;

                if (p1 > p2) {
                    comparacion = `${version1} es mayor que ${version2}`;
                    break;
                } else if (p2 > p1) {
                    comparacion = `${version2} es mayor que ${version1}`;
                    break;
                }
            }

            if (!comparacion) {
                comparacion = `${version1} y ${version2} son iguales`;
            }

            const diferencias = [
                'Correcciones de seguridad',
                'Mejoras de rendimiento',
                'Nuevas funcionalidades',
                'Cambios en la interfaz de usuario',
                'Optimización de base de datos'
            ];

            const cambios = diferencias.slice(0, Math.floor(Math.random() * 5) + 1);

            resultado.innerHTML = `
                <p><strong>Resultado:</strong> ${comparacion}</p>
                <p><strong>Posibles cambios entre versiones:</strong></p>
                <ul>
                    ${cambios.map(cambio => `<li>${cambio}</li>`).join('')}
                </ul>
            `;
        } catch (error) {
            resultado.innerHTML = `<p class="error">Error al comparar versiones: ${error.message}</p>`;
        }
    }, 1000);
}

function validarRequisitos(event) {
    event.preventDefault();
    const requisitos = document.getElementById('requisitos-texto').value.trim();

    const resultado = document.getElementById('resultado-validacion');
    resultado.innerHTML = '<p>Analizando requisitos...</p>';

    const criterios = [
        { nombre: 'Atomicidad', descripcion: 'Cada requisito debe expresar una sola idea' },
        { nombre: 'Completitud', descripcion: 'Incluye toda la información necesaria' },
        { nombre: 'Consistencia', descripcion: 'No contradice otros requisitos' },
        { nombre: 'Verificabilidad', descripcion: 'Se puede probar que se ha implementado correctamente' },
        { nombre: 'Claridad', descripcion: 'Es comprensible y no ambiguo' }
    ];

    setTimeout(() => {
        const lineas = requisitos.split('\n').filter(linea => linea.trim() !== '');
        const resultados = [];

        lineas.forEach((req, index) => {
            const evaluacion = criterios.map(criterio => {
                let cumple = true;
                let comentario = '';

                if (criterio.nombre === 'Atomicidad' && (req.includes(' y ') || req.includes(',') || req.length > 200)) {
                    cumple = false;
                    comentario = 'Posiblemente expresa múltiples ideas';
                }

                if (criterio.nombre === 'Completitud' && req.length < 30) {
                    cumple = false;
                    comentario = 'Parece incompleto';
                }

                if (criterio.nombre === 'Claridad' && (req.includes('quizás') || req.includes('tal vez') || req.includes('posiblemente'))) {
                    cumple = false;
                    comentario = 'Contiene lenguaje ambiguo';
                }

                if (criterio.nombre === 'Verificabilidad' && !req.match(/debe|deberá|será/i)) {
                    cumple = false;
                    comentario = 'No indica claramente lo que debe hacer el sistema';
                }

                return {
                    criterio: criterio.nombre,
                    cumple,
                    comentario
                };
            });

            resultados.push({
                requisito: req,
                evaluaciones: evaluacion
            });
        });

        let resultadoHTML = `<h3>Análisis de ${lineas.length} requisitos</h3>`;

        let requisitosAltoRiesgo = 0;
        let requisitosMedioRiesgo = 0;
        let requisitosBajoRiesgo = 0;

        resultados.forEach((res, index) => {
            const problemas = res.evaluaciones.filter(e => !e.cumple).length;
            const clase = problemas > 2 ? 'alto-riesgo' : (problemas > 0 ? 'medio-riesgo' : 'bajo-riesgo');

            if (problemas > 2) {
                requisitosAltoRiesgo++;
            } else if (problemas > 0) {
                requisitosMedioRiesgo++;
            } else {
                requisitosBajoRiesgo++;
            }

            resultadoHTML += `
                <div class="requisito-analizado ${clase}">
                    <p><strong>Requisito ${index + 1}:</strong> ${res.requisito}</p>
                    <p><strong>Calidad:</strong> ${problemas === 0 ? 'Alta' : (problemas > 2 ? 'Baja' : 'Media')}</p>
                    <table class="criterios-table">
                        <thead>
                            <tr>
                                <th>Criterio</th>
                                <th>Cumple</th>
                                <th>Comentario</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${res.evaluaciones.map(e => `
                                <tr>
                                    <td>${e.criterio}</td>
                                    <td>${e.cumple ? '✅' : '❌'}</td>
                                    <td>${e.comentario || 'Sin observaciones'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        });

        const totalRequisitos = lineas.length;
        resultadoHTML = `
            <div class="resumen-requisitos">
                <h3>Resumen</h3>
                <div class="estadisticas-requisitos">
                    <div class="estadistica bajo-riesgo">
                        <span class="numero">${requisitosBajoRiesgo}</span>
                        <span class="texto">Calidad Alta</span>
                        <span class="porcentaje">${Math.round((requisitosBajoRiesgo/totalRequisitos)*100)}%</span>
                    </div>
                    <div class="estadistica medio-riesgo">
                        <span class="numero">${requisitosMedioRiesgo}</span>
                        <span class="texto">Calidad Media</span>
                        <span class="porcentaje">${Math.round((requisitosMedioRiesgo/totalRequisitos)*100)}%</span>
                    </div>
                    <div class="estadistica alto-riesgo">
                        <span class="numero">${requisitosAltoRiesgo}</span>
                        <span class="texto">Calidad Baja</span>
                        <span class="porcentaje">${Math.round((requisitosAltoRiesgo/totalRequisitos)*100)}%</span>
                    </div>
                </div>
            </div>
            ${resultadoHTML}
            <button onclick="exportarAnalisisRequisitos()" class="btn-primary">Exportar Análisis</button>
        `;

        const modalContenido = document.getElementById('contenedor-validacion-requisitos');
        modalContenido.innerHTML = resultadoHTML;

        document.getElementById('modal-validacion-requisitos').style.display = 'block';

        resultado.innerHTML = '<p>Análisis completado. Ver resultados en la ventana emergente.</p>';
    }, 2000);
}

function cerrarModalValidacionRequisitos() {
    document.getElementById('modal-validacion-requisitos').style.display = 'none';
}

function exportarAnalisisRequisitos() {
    mostrarToast('El análisis de requisitos será descargado como Excel', 'success');
}

function exportarAExcel(data, filename) {
    let csvContent = "data:text/csv;charset=utf-8,";

    if (data.length > 0) {
        csvContent += Object.keys(data[0]).join(",") + "\r\n";
    }

    data.forEach(function(item) {
        let row = Object.values(item).join(",");
        csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename + ".csv");
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('plan-prueba-form')?.addEventListener('submit', generarPlanPrueba);
    document.getElementById('comparador-versiones-form')?.addEventListener('submit', compararVersiones);
    document.getElementById('validador-requisitos-form')?.addEventListener('submit', validarRequisitos);
});
