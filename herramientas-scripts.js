document.addEventListener('DOMContentLoaded', function() {
    // Animación para elementos que entran en el viewport
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-viewport');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar todos los elementos con clase .animate-fadeInUp
    document.querySelectorAll('.animate-fadeInUp').forEach(item => {
        observer.observe(item);
    });
    
    // Efecto hover para las tarjetas de herramientas
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('active');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('active');
        });
    });
    
    // Manejo de navegación entre pestañas
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-tab');
            
            // Desactivar todas las pestañas
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Activar la pestaña seleccionada
            this.classList.add('active');
            document.getElementById(target).classList.add('active');
            
            // Activar la primera categoría de la pestaña
            const firstCategoryBtn = document.querySelector(`#${target} .category-btn`);
            if (firstCategoryBtn) {
                firstCategoryBtn.click();
            }
        });
    });
    
    // Manejo de navegación entre categorías
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const parent = this.closest('.tab-content');
            const target = this.getAttribute('data-category');
            
            // Desactivar todas las categorías en esta pestaña
            parent.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            parent.querySelectorAll('.category-content').forEach(content => content.classList.remove('active'));
            
            // Activar la categoría seleccionada
            this.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });
    
    // Manejo de búsqueda de herramientas
    const searchInput = document.getElementById('tools-search');
    const searchButton = document.getElementById('search-btn');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm.length < 2) {
            showMessage('Por favor ingresa al menos 2 caracteres para buscar');
            return;
        }
        
        // Búsqueda en todas las herramientas
        const allTools = document.querySelectorAll('.tool-card');
        const results = [];
        
        allTools.forEach(tool => {
            const toolName = tool.querySelector('h3').textContent.toLowerCase();
            const toolDescription = tool.querySelector('.tool-header p').textContent.toLowerCase();
            
            if (toolName.includes(searchTerm) || toolDescription.includes(searchTerm)) {
                results.push({
                    element: tool,
                    tab: tool.closest('.tab-content').id,
                    category: tool.closest('.category-content').id
                });
            }
        });
        
        if (results.length > 0) {
            // Ir a la primera herramienta encontrada
            const firstResult = results[0];
            
            // Activar la pestaña correspondiente
            document.querySelector(`.tab-button[data-tab="${firstResult.tab}"]`).click();
            
            // Activar la categoría correspondiente
            document.querySelector(`#${firstResult.tab} .category-btn[data-category="${firstResult.category}"]`).click();
            
            // Resaltar la herramienta
            highlightTool(firstResult.element);
            
            // Mostrar mensaje con el número de resultados
            showMessage(`Se encontraron ${results.length} resultados para "${searchTerm}"`);
        } else {
            showMessage(`No se encontraron herramientas para "${searchTerm}"`);
        }
    }
    
    function highlightTool(toolElement) {
        // Quitar resaltados anteriores
        document.querySelectorAll('.tool-card.highlight').forEach(card => {
            card.classList.remove('highlight');
        });
        
        // Agregar clase de resaltado
        toolElement.classList.add('highlight');
        
        // Scroll hacia la herramienta
        setTimeout(() => {
            toolElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
        
        // Quitar resaltado después de un tiempo
        setTimeout(() => {
            toolElement.classList.remove('highlight');
        }, 3000);
    }
    
    function showMessage(message) {
        // Verificar si ya existe un mensaje
        let messageBox = document.querySelector('.search-message');
        
        if (!messageBox) {
            // Crear el elemento de mensaje
            messageBox = document.createElement('div');
            messageBox.className = 'search-message';
            document.querySelector('.tools-section .container').prepend(messageBox);
        }
        
        // Actualizar el mensaje
        messageBox.textContent = message;
        messageBox.classList.add('show');
        
        // Ocultar después de un tiempo
        setTimeout(() => {
            messageBox.classList.remove('show');
        }, 3000);
    }

    // Inicializar herramientas de tiempo
    initTimeTools();
    
    // Observar los cambios en las pestañas para reinicializar herramientas cuando sea necesario
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Si se selecciona la pestaña misc-tools, reiniciar las herramientas de tiempo
            if (tabId === 'misc-tools') {
                // Dar un pequeño retraso para asegurar que el DOM esté actualizado
                setTimeout(() => {
                    // Activar la categoría de tiempo
                    const timeCategory = document.querySelector('[data-category="time"]');
                    if (timeCategory) {
                        timeCategory.click();
                    }
                    // Reinicializar herramientas
                    initTimeTools();
                }, 100);
            }
        });
    });
    
    // También reinicializar cuando se haga clic en la categoría de tiempo
    const timeCategoryBtn = document.querySelector('[data-category="time"]');
    if (timeCategoryBtn) {
        console.log("Botón de categoría 'tiempo' encontrado");
        
        timeCategoryBtn.addEventListener('click', function() {
            console.log("Botón de categoría 'tiempo' clickeado");
            
            // Forzar la visibilidad de la sección 'time'
            const timeSection = document.getElementById('time');
            if (timeSection) {
                timeSection.style.display = 'grid';
                console.log("Sección 'time' establecida a display:grid");
                
                // Inicializar herramientas después de asegurar que la sección es visible
                setTimeout(initTimeTools, 100);
            } else {
                console.error("No se encontró la sección #time después de hacer clic en su categoría");
            }
        });
    } else {
        console.warn("Botón de categoría 'tiempo' no encontrado en el DOM");
    }

    // Agregar funcionalidad específica para activar y mostrar las herramientas de tiempo
    const timeTools = document.getElementById('time');
    if (timeTools) {
        console.log("Sección de tiempo encontrada, inicializando herramientas...");
        
        // Hacer visible la sección si está oculta
        if (window.getComputedStyle(timeTools).display === 'none') {
            console.log("La sección de tiempo está oculta, verificando si debemos activarla");
            // Buscar el botón para la categoría de tiempo
            const timeButton = document.querySelector('[data-category="time"]');
            if (timeButton) {
                console.log("Botón de categoría tiempo encontrado");
                // Si estamos en la pestaña "misc-tools", activar la categoría de tiempo
                const miscTab = document.getElementById('misc-tools');
                if (miscTab && miscTab.classList.contains('active')) {
                    console.log("Activando categoría de tiempo");
                    timeButton.click();
                }
            }
        }
        
        // Inicializar todas las herramientas de tiempo
        initAllTimeTools();
    } else {
        console.warn("No se encontró la sección de herramientas de tiempo (#time)");
    }

    // Esperar a que todo el DOM esté completamente cargado antes de inicializar herramientas
    setTimeout(function() {
        // Forzar la visualización permanente de la sección de tiempo
        const timeSection = document.getElementById('time');
        if (timeSection) {
            console.log("Asegurando visibilidad permanente de la sección de tiempo");
            
            // Forzar display grid permanente
            timeSection.style.display = 'grid';
            timeSection.style.visibility = 'visible';
            timeSection.style.opacity = '1';
            
            // Prevenir que eventos de navegación oculten la sección
            const originalDisplay = timeSection.style.display;
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.attributeName === 'style' || 
                        mutation.attributeName === 'class') {
                        if (timeSection.style.display !== originalDisplay ||
                            !timeSection.classList.contains('active')) {
                            console.log("Restaurando visibilidad de sección tiempo");
                            timeSection.style.display = 'grid';
                            timeSection.classList.add('active');
                        }
                    }
                });
            });
            
            observer.observe(timeSection, { 
                attributes: true,
                attributeFilter: ['style', 'class']
            });
            
            // Inicializar herramientas y mantenerlas visibles
            initTimeTools();
        }
    }, 500);
    
    // Modificar el comportamiento de la categoría de tiempo
    const timeCategoryBtnModified = document.querySelector('[data-category="time"]');
    if (timeCategoryBtnModified) {
        // Reemplazar el handler existente con uno que garantice visibilidad
        timeCategoryBtnModified.addEventListener('click', function(e) {
            // Prevenir comportamiento predeterminado
            e.stopPropagation();
            
            console.log("Botón de tiempo clickeado - forzando visibilidad");
            
            // Activar el botón
            const categoryBtns = document.querySelectorAll('.category-btn');
            categoryBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Activar la sección y hacerla visible
            const timeSection = document.getElementById('time');
            if (timeSection) {
                const categories = document.querySelectorAll('.category-content');
                categories.forEach(cat => cat.classList.remove('active'));
                
                timeSection.classList.add('active');
                timeSection.style.display = 'grid';
                timeSection.style.visibility = 'visible';
                timeSection.style.opacity = '1';
                
                // Reinicializar herramientas
                setTimeout(initTimeTools, 50);
            }
        }, true);
    }

    // Inicializar herramientas de automatización
    initAutomationTools();

    // Inicialización directa de la calculadora de esperas
    setTimeout(function() {
        // Buscar si estamos en la sección de automatización
        const automationTab = document.getElementById('automation-tools');
        if (automationTab && automationTab.classList.contains('active')) {
            console.log("Inicialización directa de la Calculadora de Esperas en sección de automatización");
            initWaitCalculator();
        }
    }, 1000);

    // Inicializar herramientas específicas
    initTestDataGenerator();
    initTestPlanGenerator();

    // Generador de Datos de Prueba
    const testDataForm = document.getElementById('test-data-generator-form');
    const testDataResult = document.getElementById('test-data-generator-result');
    const testButton = document.getElementById('test-data-generator-test-btn');

    if (testDataForm && testDataResult && testButton) {
        testButton.addEventListener('click', function () {
            console.log("Botón Test clickeado");

            // Valores de prueba
            const dataTypes = ['names', 'emails', 'phones']; // Tipos de datos
            const dataLocale = 'es-CO'; // Localización
            const dataFormat = 'json'; // Formato
            const dataCount = 3; // Cantidad

            let resultHTML = `<h4>Datos Generados (${dataFormat.toUpperCase()}):</h4><pre><code>`;
            for (let i = 0; i < dataCount; i++) {
                const record = {};
                dataTypes.forEach(type => {
                    record[type] = generateTestData(type);
                });
                resultHTML += formatData(record, dataFormat) + '\n';
            }
            resultHTML += `</code></pre>`;

            // Mostrar resultados en el contenedor
            testDataResult.innerHTML = resultHTML;
        });

        function generateTestData(type) {
            try {
                // Usar la función de verificación
                const generator = window.checkDataGenerator();
                return generator.generate(type);
            } catch (error) {
                console.error('Error al generar datos:', error);
                return 'Error: ' + error.message;
            }
        }

        function formatData(record, format) {
            switch (format) {
                case 'json': return JSON.stringify(record);
                case 'csv': return Object.values(record).join(',');
                case 'sql': return `INSERT INTO table (${Object.keys(record).join(', ')}) VALUES (${Object.values(record).map(v => `'${v}'`).join(', ')});`;
                case 'xml': return `<record>${Object.entries(record).map(([k, v]) => `<${k}>${v}</${k}>`).join('')}</record>`;
                default: return JSON.stringify(record);
            }
        }
    }

    // Generador de Datos
    const dataGeneratorForm = document.getElementById('data-generator-form');
    const dataGeneratorResult = document.getElementById('data-generator-result');

    if (dataGeneratorForm && dataGeneratorResult) {
        dataGeneratorForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Obtener valores del formulario
            const dataTypes = Array.from(document.querySelectorAll('.data-types input:checked')).map(input => input.value);
            const dataCount = parseInt(document.getElementById('data-count').value, 10);
            const dataFormat = document.getElementById('data-format').value;

            if (dataTypes.length === 0 || isNaN(dataCount) || dataCount <= 0) {
                dataGeneratorResult.innerHTML = '<p class="text-danger">Por favor selecciona al menos un tipo de dato y una cantidad válida</p>';
                return;
            }

            // Generar datos
            const records = [];
            for (let i = 0; i < dataCount; i++) {
                const record = {};
                dataTypes.forEach(type => {
                    record[type] = generateTestData(type);
                });
                records.push(record);
            }

            let resultHTML = '';
            switch (dataFormat) {
                case 'json':
                    resultHTML = `<pre><code>${JSON.stringify(records, null, 2)}</code></pre>`;
                    break;
                case 'csv':
                    const headers = dataTypes.join(',');
                    const rows = records.map(record => dataTypes.map(type => record[type]).join(',')).join('\n');
                    resultHTML = `<pre><code>${headers}\n${rows}</code></pre>`;
                    break;
                case 'sql':
                    const tableName = 'test_data';
                    resultHTML = `<pre><code>${records.map(record => {
                        const columns = Object.keys(record).join(', ');
                        const values = Object.values(record).map(v => `'${v}'`).join(', ');
                        return `INSERT INTO ${tableName} (${columns}) VALUES (${values});`;
                    }).join('\n')}</code></pre>`;
                    break;
                case 'xml':
                    const xmlRows = records.map(record => {
                        const fields = Object.entries(record)
                            .map(([key, value]) => `    <${key}>${value}</${key}>`)
                            .join('\n');
                        return `  <record>\n${fields}\n  </record>`;
                    }).join('\n');
                    resultHTML = `<pre><code><?xml version="1.0" encoding="UTF-8"?>\n<data>\n${xmlRows}\n</data></code></pre>`;
                    break;
            }

            dataGeneratorResult.innerHTML = resultHTML;

            // Añadir botón para copiar
            dataGeneratorResult.innerHTML += `
                <button class="tool-btn mt-3 copy-btn" onclick="copyToClipboard(this)">
                    <i class="fas fa-copy"></i> Copiar datos
                </button>
            `;
        });

        function generateTestData(type) {
            try {
                // Usar la función de verificación
                const generator = window.checkDataGenerator();
                return generator.generate(type);
            } catch (error) {
                console.error('Error al generar datos:', error);
                return 'Error: ' + error.message;
            }
        }
    }
});

// Añade una función para verificar y corregir elementos faltantes en el DOM
function verifyTimeToolsDOM() {
    console.log("Verificando elementos DOM de herramientas de tiempo...");
    
    const timeSection = document.getElementById('time');
    if (!timeSection) {
        console.error("ERROR: No se encontró la sección de tiempo (#time)");
        return false;
    }
    
    console.log("Sección de tiempo encontrada");
    
    // Verificar si la sección está vacía y corregir si es necesario
    if (timeSection.children.length === 0) {
        console.warn("La sección de tiempo está vacía, añadiendo herramientas dinámicamente...");
        
        // Intentar cargar las herramientas dinámicamente
        createTimeTools(timeSection);
        return true;
    }
    
    console.log("La sección de tiempo contiene elementos: " + timeSection.children.length);
    return true;
}

// Crear herramientas de tiempo dinámicamente si no existen en el DOM
function createTimeTools(container) {
    // Herramienta 1: Cronómetro
    const cronometro = document.createElement('div');
    cronometro.className = 'tool-card premium-tool';
    cronometro.innerHTML = `
        <div class="tool-header">
            <div class="tool-icon">
                <i class="fas fa-clock"></i>
            </div>
            <div class="tool-badge">Nuevo</div>
            <h3>Cronómetro</h3>
            <p>Mide tiempos con precisión</p>
        </div>
        <div class="tool-body">
            <p>Inicia, pausa y reinicia un cronómetro para medir tus tiempos con precisión.</p>
            <div id="stopwatch" class="time-tool">
                <div id="stopwatch-display" class="time-display">00:00:00</div>
                <div class="button-group">
                    <button id="start-stopwatch" class="tool-btn">Iniciar</button>
                    <button id="pause-stopwatch" class="tool-btn">Pausar</button>
                    <button id="reset-stopwatch" class="tool-btn">Reiniciar</button>
                </div>
            </div>
        </div>
    `;
    container.appendChild(cronometro);
    
    // Herramienta 2: Temporizador
    const temporizador = document.createElement('div');
    temporizador.className = 'tool-card';
    temporizador.innerHTML = `
        <div class="tool-header">
            <div class="tool-icon">
                <i class="fas fa-hourglass-half"></i>
            </div>
            <h3>Temporizador</h3>
            <p>Configura alertas por tiempo</p>
        </div>
        <div class="tool-body">
            <p>Configura un temporizador para tus actividades y recibe una alerta cuando termine.</p>
            <form id="timer-form">
                <div class="time-input">
                    <label for="timer-minutes">Minutos:</label>
                    <input type="number" id="timer-minutes" placeholder="Ejemplo: 5" required>
                </div>
                <button type="submit" class="tool-btn">Iniciar Temporizador</button>
            </form>
            <div id="timer-display" class="time-display">00:00</div>
        </div>
    `;
    container.appendChild(temporizador);
    
    // Herramienta 3: Calculadora de Fechas
    const calculadora = document.createElement('div');
    calculadora.className = 'tool-card';
    calculadora.innerHTML = `
        <div class="tool-header">
            <div class="tool-icon">
                <i class="fas fa-calendar-alt"></i>
            </div>
            <div class="tool-badge">Nuevo</div>
            <h3>Calculadora de Fechas</h3>
            <p>Calcula días entre fechas</p>
        </div>
        <div class="tool-body">
            <p>Calcula la diferencia exacta entre dos fechas en días, semanas, meses y años.</p>
            <form id="date-calculator-form">
                <div class="form-group">
                    <label for="start-date-calc">Fecha Inicial:</label>
                    <input type="date" id="start-date-calc" required>
                </div>
                <div class="form-group">
                    <label for="end-date-calc">Fecha Final:</label>
                    <input type="date" id="end-date-calc" required>
                </div>
                <button type="submit" class="tool-btn">Calcular Diferencia</button>
            </form>
            <div id="date-calc-result" class="resultado"></div>
        </div>
    `;
    container.appendChild(calculadora);
    
    // Agregar también las demás herramientas (zonasHorarias, pomodoro, notas)
    // ...
    
    console.log("Herramientas de tiempo creadas dinámicamente");
}

// Modificar la función initTimeTools para quitar la inicialización de la calculadora de esperas
function initTimeTools() {
    console.log("Inicializando herramientas de tiempo...");
    
    // Verificar y corregir el DOM si es necesario
    if (!verifyTimeToolsDOM()) {
        console.error("No se pudieron inicializar las herramientas de tiempo por problemas en el DOM");
        return;
    }
    
    // Continuar con la inicialización normal
    // 1. Cronómetro
    initStopwatch();
    
    // 2. Temporizador
    initTimer();
    
    // 3. Calculadora de Fechas
    initDateCalculator();
    
    // 4. Zonas Horarias
    initTimezones();
    
    // 5. Pomodoro Timer
    initPomodoro();
    
    // 6. Notas Rápidas
    initQuickNotes();
    
    console.log("Todas las herramientas de tiempo han sido inicializadas correctamente");
}

// Modificar la función initAllTimeTools para quitar la calculadora de esperas
function initAllTimeTools() {
    console.log("Iniciando herramientas de tiempo...");
    
    // 1. Cronómetro
    initStopwatch();
    
    // 2. Temporizador
    initTimer();
    
    // 3. Calculadora de Fechas
    initDateCalculator();
    
    // 4. Zonas Horarias
    initTimezones();
    
    // 5. Pomodoro Timer
    initPomodoro();
    
    // 6. Notas Rápidas
    initQuickNotes();
    
    console.log("Todas las herramientas de tiempo han sido inicializadas correctamente");
}

// Función para inicializar la Calculadora de Esperas
function initWaitCalculator() {
    console.log("Inicializando Calculadora de Esperas...");
    const waitCalculatorForm = document.getElementById('wait-calculator-form');
    const waitCalculatorResult = document.getElementById('wait-calculator-result');
    
    if (!waitCalculatorForm || !waitCalculatorResult) {
        console.error("No se encontró el formulario o el contenedor de resultados de la Calculadora de Esperas");
        console.log("waitCalculatorForm:", waitCalculatorForm);
        console.log("waitCalculatorResult:", waitCalculatorResult);
        return;
    }
    
    console.log("Formulario de Calculadora de Esperas encontrado, añadiendo event listener");
    
    // Eliminar event listeners existentes para evitar duplicación
    const newForm = waitCalculatorForm.cloneNode(true);
    waitCalculatorForm.parentNode.replaceChild(newForm, waitCalculatorForm);
    
    // Añadir event listener al nuevo formulario
    newForm.addEventListener('submit', function(e) {
        // Prevenir el comportamiento predeterminado del formulario
        e.preventDefault();
        
        console.log("Formulario de Calculadora de Esperas enviado");
        
        // Obtener los valores de los campos
        const baseTimeInput = document.getElementById('base-time');
        const pollFrequencyInput = document.getElementById('poll-frequency');
        const timeoutFactorInput = document.getElementById('timeout-factor');
        
        if (!baseTimeInput || !pollFrequencyInput || !timeoutFactorInput) {
            console.error("Campos del formulario no encontrados:");
            console.log("baseTimeInput:", baseTimeInput);
            console.log("pollFrequencyInput:", pollFrequencyInput);
            console.log("timeoutFactorInput:", timeoutFactorInput);
            
            waitCalculatorResult.innerHTML = '<p class="text-danger">Error: No se pudieron encontrar los campos del formulario. Por favor, asegúrate de que el formulario esté correctamente implementado.</p>';
            return;
        }
        
        // Obtener valores y convertirlos a números
        const baseTime = parseFloat(baseTimeInput.value);
        const pollFrequency = parseFloat(pollFrequencyInput.value);
        const timeoutFactor = parseFloat(timeoutFactorInput.value);
        
        console.log("Valores del formulario:", {baseTime, pollFrequency, timeoutFactor});
        
        // Validar los valores
        if (isNaN(baseTime) || isNaN(pollFrequency) || isNaN(timeoutFactor)) {
            waitCalculatorResult.innerHTML = '<p class="text-danger">Por favor ingresa valores numéricos válidos</p>';
            return;
        }
        
        if (baseTime <= 0 || pollFrequency <= 0 || timeoutFactor <= 0) {
            waitCalculatorResult.innerHTML = '<p class="text-danger">Los valores deben ser mayores que cero</p>';
            return;
        }
        
        // Realizar cálculos
        const explicitWait = baseTime;
        const implicitWait = baseTime;
        const fluentWait = baseTime;
        const timeout = baseTime * timeoutFactor;
        const pollInterval = pollFrequency;
        
        // Mostrar resultados
        waitCalculatorResult.innerHTML = `
            <h4>Tiempos de espera recomendados:</h4>
            <ul class="wait-result-list">
                <li><strong>Explicit Wait:</strong> ${explicitWait.toFixed(1)} segundos</li>
                <li><strong>Implicit Wait:</strong> ${implicitWait.toFixed(1)} segundos</li>
                <li><strong>Fluent Wait:</strong> 
                    <ul>
                        <li>Timeout: ${timeout.toFixed(1)} segundos</li>
                        <li>Poll: ${pollInterval.toFixed(1)} segundos</li>
                    </ul>
                </li>
                <li><strong>PageLoad Timeout:</strong> ${(timeout * 2).toFixed(1)} segundos</li>
                <li><strong>Script Timeout:</strong> ${(timeout * 1.5).toFixed(1)} segundos</li>
            </ul>
            <div class="recommendations">
                <h4>Código de ejemplo:</h4>
                <pre><code>// Ejemplo con Selenium WebDriver (Java)
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(${timeout.toFixed(1)}));
wait.pollingEvery(Duration.ofSeconds(${pollInterval.toFixed(1)}));
wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("elemento")));</code></pre>
            </div>
        `;
        
        console.log("Resultados de la calculadora de esperas mostrados correctamente");
    });
}

// 1. Función para inicializar el cronómetro
function initStopwatch() {
    const stopwatchDisplay = document.getElementById('stopwatch-display');
    const startBtn = document.getElementById('start-stopwatch');
    const pauseBtn = document.getElementById('pause-stopwatch');
    const resetBtn = document.getElementById('reset-stopwatch');
    
    if (!stopwatchDisplay || !startBtn || !pauseBtn || !resetBtn) return;
    
    let startTime;
    let elapsedTime = 0;
    let stopwatchInterval;
    let running = false;
    
    startBtn.addEventListener('click', function() {
        if (!running) {
            running = true;
            startTime = Date.now() - elapsedTime;
            stopwatchInterval = setInterval(updateStopwatch, 10);
            
            startBtn.disabled = true;
            pauseBtn.disabled = false;
        }
    });
    
    pauseBtn.addEventListener('click', function() {
        if (running) {
            running = false;
            clearInterval(stopwatchInterval);
            elapsedTime = Date.now() - startTime;
            
            startBtn.disabled = false;
            pauseBtn.disabled = true;
        }
    });
    
    resetBtn.addEventListener('click', function() {
        running = false;
        clearInterval(stopwatchInterval);
        elapsedTime = 0;
        stopwatchDisplay.textContent = '00:00:00';
        
        startBtn.disabled = false;
        pauseBtn.disabled = false;
    });
    
    function updateStopwatch() {
        const currentTime = Date.now();
        elapsedTime = currentTime - startTime;
        
        let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
        let minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
        
        hours = hours.toString().padStart(2, '0');
        minutes = minutes.toString().padStart(2, '0');
        seconds = seconds.toString().padStart(2, '0');
        
        stopwatchDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    // Inicializar botones
    pauseBtn.disabled = true;
}

// 2. Función para inicializar el temporizador
function initTimer() {
    const timerForm = document.getElementById('timer-form');
    const timerMinutes = document.getElementById('timer-minutes');
    const timerDisplay = document.getElementById('timer-display');
    
    if (!timerForm || !timerMinutes || !timerDisplay) return;
    
    let timerInterval;
    let remainingTime = 0;
    
    timerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const minutes = parseInt(timerMinutes.value);
        if (isNaN(minutes) || minutes <= 0) {
            alert('Por favor ingresa un número válido de minutos');
            return;
        }
        
        // Detener temporizador anterior si existe
        clearInterval(timerInterval);
        
        // Configurar nuevo temporizador
        remainingTime = minutes * 60;
        updateTimerDisplay();
        
        timerInterval = setInterval(function() {
            remainingTime--;
            
            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                timerDisplay.textContent = '00:00';
                
                // Notificar que terminó el tiempo
                new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3').play();
                
                // Mostrar alerta
                alert('¡Tiempo completado!');
                return;
            }
            
            updateTimerDisplay();
        }, 1000);
    });
    
    function updateTimerDisplay() {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        
        const displayMinutes = minutes.toString().padStart(2, '0');
        const displaySeconds = seconds.toString().padStart(2, '0');
        
        timerDisplay.textContent = `${displayMinutes}:${displaySeconds}`;
    }
}

// 3. Función para inicializar la calculadora de fechas
function initDateCalculator() {
    const dateCalcForm = document.getElementById('date-calculator-form');
    const startDateCalc = document.getElementById('start-date-calc');
    const endDateCalc = document.getElementById('end-date-calc');
    const dateCalcResult = document.getElementById('date-calc-result');
    
    if (!dateCalcForm || !startDateCalc || !endDateCalc || !dateCalcResult) return;
    
    // Establecer fecha predeterminada como hoy
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    startDateCalc.value = todayStr;
    
    dateCalcForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const startDate = new Date(startDateCalc.value);
        const endDate = new Date(endDateCalc.value);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            dateCalcResult.innerHTML = '<p class="text-danger">Por favor ingresa fechas válidas</p>';
            return;
        }
        
        // Calcular diferencia en días
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Calcular diferencia en semanas
        const diffWeeks = Math.floor(diffDays / 7);
        const remainingDays = diffDays % 7;
        
        // Calcular diferencia en meses y años aproximados
        let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
        months += endDate.getMonth() - startDate.getMonth();
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        
        // Determinar si es fecha futura o pasada
        const isFuture = endDate > startDate;
        const isPast = endDate < startDate;
        const isToday = diffDays === 0;
        
        let resultHTML = '';
        
        if (isToday) {
            resultHTML = '<p><strong>Las fechas son iguales</strong></p>';
        } else {
            const direction = isFuture ? 'hacia el futuro' : 'en el pasado';
            
            resultHTML = `
                <p><strong>${diffDays}</strong> días ${direction}</p>
                <p><strong>${diffWeeks}</strong> semanas y <strong>${remainingDays}</strong> días</p>
                <p><strong>${months}</strong> meses aproximados</p>
            `;
            
            if (years > 0) {
                resultHTML += `<p><strong>${years}</strong> años y <strong>${remainingMonths}</strong> meses</p>`;
            }
        }
        
        dateCalcResult.innerHTML = resultHTML;
    });
}

// 4. Función para inicializar las zonas horarias
function initTimezones() {
    const timezoneForm = document.getElementById('timezone-form');
    const timezoneSelect = document.getElementById('timezone-select');
    const timezoneResult = document.getElementById('timezone-result');
    
    if (!timezoneForm || !timezoneSelect || !timezoneResult) return;
    
    timezoneForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const selectedTimezone = timezoneSelect.value;
        if (!selectedTimezone) {
            timezoneResult.innerHTML = '<p class="text-danger">Por favor selecciona una zona horaria</p>';
            return;
        }
        
        try {
            const options = {
                timeZone: selectedTimezone,
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            
            const formatter = new Intl.DateTimeFormat('es-ES', options);
            const localTime = formatter.format(new Date());
            
            const cityName = timezoneSelect.options[timezoneSelect.selectedIndex].text;
            
            timezoneResult.innerHTML = `
                <p><strong>Hora actual en ${cityName}:</strong></p>
                <p class="time-zone-display">${localTime}</p>
                <p><small>Zona horaria: ${selectedTimezone}</small></p>
            `;
        } catch (error) {
            timezoneResult.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
        }
    });
}

// 5. Función para inicializar el Pomodoro Timer
function initPomodoro() {
    const pomodoroDisplay = document.getElementById('pomodoro-display');
    const startPomodoro = document.getElementById('start-pomodoro');
    const resetPomodoro = document.getElementById('reset-pomodoro');
    const pomodoroStatus = document.querySelector('.pomodoro-status');
    const pomodoroCycles = document.getElementById('pomodoro-cycles');
    
    if (!pomodoroDisplay || !startPomodoro || !resetPomodoro || !pomodoroStatus || !pomodoroCycles) return;
    
    const WORK_TIME = 25 * 60; // 25 minutos en segundos
    const BREAK_TIME = 5 * 60; // 5 minutos en segundos
    
    let timer;
    let isRunning = false;
    let isWorkPhase = true;
    let timeRemaining = WORK_TIME;
    let cycles = 0;
    
    // Actualizar display
    updatePomodoroDisplay();
    
    startPomodoro.addEventListener('click', function() {
        if (!isRunning) {
            isRunning = true;
            startPomodoro.textContent = 'Pausar';
            pomodoroStatus.textContent = isWorkPhase ? 'Trabajando...' : 'Descanso...';
            pomodoroDisplay.classList.add(isWorkPhase ? 'pomodoro-work' : 'pomodoro-break');
            
            timer = setInterval(function() {
                timeRemaining--;
                
                if (timeRemaining <= 0) {
                    clearInterval(timer);
                    
                    // Sonido de notificación
                    new Audio('https://assets.mixkit.co/sfx/preview/mixkit-bell-notification-933.mp3').play();
                    
                    if (isWorkPhase) {
                        // Cambiar a fase de descanso
                        isWorkPhase = false;
                        timeRemaining = BREAK_TIME;
                        cycles++;
                        pomodoroCycles.textContent = cycles;
                        pomodoroStatus.textContent = '¡Toma un descanso!';
                        pomodoroDisplay.classList.remove('pomodoro-work');
                        pomodoroDisplay.classList.add('pomodoro-break');
                    } else {
                        // Cambiar a fase de trabajo
                        isWorkPhase = true;
                        timeRemaining = WORK_TIME;
                        pomodoroStatus.textContent = '¡Vuelve al trabajo!';
                        pomodoroDisplay.classList.remove('pomodoro-break');
                        pomodoroDisplay.classList.add('pomodoro-work');
                    }
                    
                    updatePomodoroDisplay();
                    
                    // Reiniciar temporizador automáticamente
                    isRunning = false;
                    startPomodoro.click();
                } else {
                    updatePomodoroDisplay();
                }
            }, 1000);
        } else {
            // Pausar el temporizador
            isRunning = false;
            clearInterval(timer);
            startPomodoro.textContent = 'Reanudar';
            pomodoroStatus.textContent = 'Pausado';
            pomodoroDisplay.classList.remove('pomodoro-work', 'pomodoro-break');
        }
    });
    
    resetPomodoro.addEventListener('click', function() {
        clearInterval(timer);
        isRunning = false;
        isWorkPhase = true;
        timeRemaining = WORK_TIME;
        startPomodoro.textContent = 'Iniciar';
        pomodoroStatus.textContent = 'Listo para comenzar';
        pomodoroDisplay.classList.remove('pomodoro-work', 'pomodoro-break');
        updatePomodoroDisplay();
    });
    
    function updatePomodoroDisplay() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        
        const displayMinutes = minutes.toString().padStart(2, '0');
        const displaySeconds = seconds.toString().padStart(2, '0');
        
        pomodoroDisplay.textContent = `${displayMinutes}:${displaySeconds}`;
    }
}

// 6. Función para inicializar las Notas Rápidas
function initQuickNotes() {
    const quickNote = document.getElementById('quick-note');
    const saveNoteBtn = document.getElementById('save-note');
    const clearNoteBtn = document.getElementById('clear-note');
    const noteStatus = document.getElementById('note-status');
    
    if (!quickNote || !saveNoteBtn || !clearNoteBtn || !noteStatus) return;
    
    // Cargar nota guardada si existe
    const savedNote = localStorage.getItem('quickNote');
    if (savedNote) {
        quickNote.value = savedNote;
    }
    
    saveNoteBtn.addEventListener('click', function() {
        const noteText = quickNote.value.trim();
        
        if (noteText) {
            localStorage.setItem('quickNote', noteText);
            noteStatus.textContent = 'Nota guardada correctamente';
            noteStatus.className = 'resultado saved';
            
            // Ocultar mensaje después de 3 segundos
            setTimeout(() => {
                noteStatus.textContent = '';
                noteStatus.className = 'resultado';
            }, 3000);
        } else {
            noteStatus.textContent = 'La nota está vacía';
            noteStatus.className = 'resultado';
        }
    });
    
    clearNoteBtn.addEventListener('click', function() {
        quickNote.value = '';
        localStorage.removeItem('quickNote');
        
        noteStatus.textContent = 'Nota borrada';
        noteStatus.className = 'resultado cleared';
        
        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
            noteStatus.textContent = '';
            noteStatus.className = 'resultado';
        }, 3000);
    });
    
    // Auto-guardar al escribir (con debounce)
    let saveTimeout;
    quickNote.addEventListener('input', function() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(function() {
            const noteText = quickNote.value.trim();
            if (noteText) {
                localStorage.setItem('quickNote', noteText);
            }
        }, 1000);
    });
}

// Añadir CSS para animaciones y mensajes
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .in-viewport {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @media (prefers-reduced-motion: reduce) {
            .in-viewport {
                animation: none;
                opacity: 1;
            }
        }
        
        .tool-card.active {
            border-color: var(--primary-color);
        }
        
        .tool-card.active .tool-icon {
            transform: scale(1.1);
            color: var(--accent-color);
        }
        
        .tool-card.highlight {
            animation: pulse 1.5s infinite;
            border-color: var(--accent-color);
            box-shadow: 0 0 20px rgba(255, 193, 7, 0.5);
        }
        
        @keyframes pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.7);
            }
            70% {
                box-shadow: 0 0 0 15px rgba(255, 193, 7, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
            }
        }
        
        .search-message {
            background-color: var(--primary-color);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            text-align: center;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        }
        
        .search-message.show {
            opacity: 1;
            transform: translateY(0);
        }
    </style>
`);

// Funciones para las herramientas de automatización

// 1. Generador de Selectores
function initSelectorGenerator() {
    const selectorForm = document.getElementById('selector-generator-form');
    const selectorResult = document.getElementById('selector-result');
    
    if (!selectorForm || !selectorResult) return;
    
    console.log("Formulario del Generador de Selectores encontrado, añadiendo event listener");
    
    // Clonar el formulario para eliminar cualquier event listener anterior
    const newForm = selectorForm.cloneNode(true);
    selectorForm.parentNode.replaceChild(newForm, selectorForm);
    
    newForm.addEventListener('submit', function(e) {
        // IMPORTANTE: Prevenir la recarga de la página
        e.preventDefault();
        console.log("Formulario de Generador de Selectores enviado - evento prevenido");
        
        const htmlInput = document.getElementById('html-input').value.trim();
        if (!htmlInput) {
            selectorResult.innerHTML = '<p class="text-danger">Por favor ingresa el HTML del elemento</p>';
            return;
        }
        
        const selectedTypes = [];
        document.querySelectorAll('.selector-types input[type="checkbox"]:checked').forEach(cb => {
            selectedTypes.push(cb.value);
        });
        
        if (selectedTypes.length === 0) {
            selectorResult.innerHTML = '<p class="text-warning">Por favor selecciona al menos un tipo de selector</p>';
            return;
        }
        
        try {
            // Crear un elemento temporal para analizar el HTML
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = htmlInput;
            const element = tempContainer.firstElementChild;
            
            if (!element) {
                selectorResult.innerHTML = '<p class="text-danger">HTML inválido o no contiene elementos</p>';
                return;
            }
            
            let resultHTML = '<h4>Selectores generados:</h4><ul class="selector-list">';
            
            // Generar selectores según los tipos seleccionados
            if (selectedTypes.includes('css')) {
                const cssSelector = generateCssSelector(element);
                resultHTML += `<li><strong>CSS:</strong> <code>${cssSelector}</code></li>`;
            }
            
            if (selectedTypes.includes('xpath')) {
                const xpathSelector = generateXPathSelector(element);
                resultHTML += `<li><strong>XPath:</strong> <code>${xpathSelector}</code></li>`;
            }
            
            if (selectedTypes.includes('id') && element.id) {
                resultHTML += `<li><strong>ID:</strong> <code>${element.id}</code></li>`;
            }
            
            if (selectedTypes.includes('name') && element.getAttribute('name')) {
                resultHTML += `<li><strong>Name:</strong> <code>${element.getAttribute('name')}</code></li>`;
            }
            
            resultHTML += '</ul>';
            selectorResult.innerHTML = resultHTML;
            
            // Añadir un botón para copiar los selectores
            selectorResult.innerHTML += `
                <button class="tool-btn mt-3 copy-btn" onclick="copySelectorsToClipboard(this)">
                    <i class="fas fa-copy"></i> Copiar selectores
                </button>
            `;
        } catch (error) {
            selectorResult.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
        }
    });
    
    // Función para generar selector CSS
    function generateCssSelector(element) {
        let selector = element.tagName.toLowerCase();
        
        if (element.id) {
            return `#${element.id}`;
        }
        
        if (element.className) {
            const classes = element.className.split(' ').filter(c => c.trim() !== '');
            if (classes.length > 0) {
                selector += `.${classes.join('.')}`;
            }
        }
        
        // Añadir atributos para mayor precisión
        ['name', 'type', 'placeholder', 'value'].forEach(attr => {
            if (element.getAttribute(attr)) {
                selector += `[${attr}="${element.getAttribute(attr)}"]`;
            }
        });
        
        return selector;
    }
    
    // Función para generar selector XPath
    function generateXPathSelector(element) {
        // Implementación básica de XPath
        if (element.id) {
            return `//${element.tagName.toLowerCase()}[@id="${element.id}"]`;
        }
        
        let xpath = `//${element.tagName.toLowerCase()}`;
        
        if (element.className) {
            const classes = element.className.split(' ').filter(c => c.trim() !== '');
            if (classes.length > 0) {
                xpath += `[@class="${element.className}"]`;
            }
        }
        
        ['name', 'type', 'placeholder'].forEach(attr => {
            if (element.getAttribute(attr)) {
                xpath += `[@${attr}="${element.getAttribute(attr)}"]`;
            }
        });
        
        return xpath;
    }
}

// Función para copiar los selectores al portapapeles
function copySelectorsToClipboard(button) {
    const selectorList = button.parentElement.querySelector('.selector-list');
    let text = '';
    
    selectorList.querySelectorAll('li').forEach(item => {
        const label = item.querySelector('strong').textContent;
        const selector = item.querySelector('code').textContent;
        text += `${label} ${selector}\n`;
    });
    
    navigator.clipboard.writeText(text)
        .then(() => {
            // Cambiar texto del botón temporalmente
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 2000);
        })
        .catch(err => {
            console.error('Error al copiar: ', err);
        });
}

// 2. Generador de Requests para API
function initRequestGenerator() {
    const requestForm = document.getElementById('request-generator-form');
    const requestResult = document.getElementById('request-generator-result');
    
    if (!requestForm || !requestResult) return;
    
    console.log("Formulario del Generador de Requests encontrado, añadiendo event listener");
    
    // Clonar el formulario para eliminar cualquier event listener anterior
    const newForm = requestForm.cloneNode(true);
    requestForm.parentNode.replaceChild(newForm, requestForm);
    
    newForm.addEventListener('submit', function(e) {
        // IMPORTANTE: Esto previene que la página se recargue al enviar el formulario
        e.preventDefault();
        console.log("Formulario de Generador de Requests enviado - evento prevenido");
        
        const method = document.getElementById('request-method').value;
        const url = document.getElementById('request-url').value.trim();
        let headers = document.getElementById('request-headers').value.trim();
        let body = document.getElementById('request-body').value.trim();
        const framework = document.getElementById('request-framework').value;
        
        if (!url) {
            requestResult.innerHTML = '<p class="text-danger">Por favor ingresa una URL válida</p>';
            return;
        }
        
        // Convertir headers y body a objetos si están en formato JSON
        try {
            headers = headers ? JSON.parse(headers) : {};
        } catch (error) {
            requestResult.innerHTML = '<p class="text-danger">Error en el formato JSON de headers</p>';
            return;
        }
        
        try {
            body = body ? JSON.parse(body) : null;
        } catch (error) {
            requestResult.innerHTML = '<p class="text-danger">Error en el formato JSON del body</p>';
            return;
        }
        
        // Generar código según el framework seleccionado
        let code = '';
        
        switch (framework) {
            case 'restassured':
                code = generateRestAssuredCode(method, url, headers, body);
                break;
            case 'requests':
                code = generateRequestsCode(method, url, headers, body);
                break;
            case 'fetch':
                code = generateFetchCode(method, url, headers, body);
                break;
            case 'postman':
                code = generatePostmanCode(method, url, headers, body);
                break;
            default:
                code = 'Framework no soportado';
        }
        
        requestResult.innerHTML = `<pre><code>${escapeHtml(code)}</code></pre>`;
        
        // Añadir un botón para copiar el código generado
        requestResult.innerHTML += `
            <button class="tool-btn mt-3 copy-btn" onclick="copyToClipboard(this)">
                <i class="fas fa-copy"></i> Copiar código
            </button>
        `;
        
        console.log("Código de request generado correctamente para el framework:", framework);
    });
}

// Simulador de API - Asegurarnos que no recarga la página
function initApiSimulator() {
    const apiSimulatorForm = document.getElementById('api-simulator-form');
    const apiSimulatorResult = document.getElementById('api-simulator-result');
    const responseTypeSelect = document.getElementById('response-type');
    const customResponseGroup = document.querySelector('.custom-response-group');
    const delayTimeInput = document.getElementById('delay-time');
    const delayValueDisplay = document.getElementById('delay-value');
    
    if (!apiSimulatorForm || !apiSimulatorResult) return;
    
    console.log("Formulario del Simulador de API encontrado, añadiendo event listener");
    
    // Mostrar/ocultar el campo de respuesta personalizada según la selección
    if (responseTypeSelect) {
        responseTypeSelect.addEventListener('change', function() {
            if (this.value === 'custom' && customResponseGroup) {
                customResponseGroup.style.display = 'block';
            } else if (customResponseGroup) {
                customResponseGroup.style.display = 'none';
            }
        });
    }
    
    // Actualizar visualización del valor de retraso
    if (delayTimeInput && delayValueDisplay) {
        delayTimeInput.addEventListener('input', function() {
            delayValueDisplay.textContent = this.value + ' ms';
        });
    }
    
    // Clonar el formulario para eliminar cualquier event listener anterior
    const newForm = apiSimulatorForm.cloneNode(true);
    apiSimulatorForm.parentNode.replaceChild(newForm, apiSimulatorForm);
    
    // Manejar envío del formulario
    newForm.addEventListener('submit', function(e) {
        // IMPORTANTE: Prevenir la recarga de la página
        e.preventDefault();
        console.log("Formulario de Simulador de API enviado - evento prevenido");
        
        const endpoint = document.getElementById('api-endpoint').value.trim();
        const statusCode = document.getElementById('response-status').value;
        const responseType = document.getElementById('response-type').value;
        const delayTime = parseInt(document.getElementById('delay-time').value);
        
        // Mostrar indicador de carga
        apiSimulatorResult.innerHTML = '<p class="text-info">Simulando respuesta, espere por favor...</p>';
        
        // Generar respuesta según el tipo seleccionado
        let response;
        
        if (responseType === 'custom') {
            const customResponse = document.getElementById('custom-response').value.trim();
            try {
                response = JSON.parse(customResponse);
            } catch (error) {
                apiSimulatorResult.innerHTML = '<p class="text-danger">Error: JSON personalizado inválido</p>';
                return;
            }
        } else {
            response = generateMockResponse(endpoint, responseType, statusCode);
        }
        
        // Simular tiempo de respuesta
        setTimeout(() => {
            // Construir respuesta HTTP completa
            const httpResponse = {
                status: parseInt(statusCode),
                statusText: getStatusText(statusCode),
                headers: {
                    'Content-Type': 'application/json',
                    'X-Powered-By': 'QualiTest API Simulator',
                    'Date': new Date().toUTCString()
                },
                body: response
            };
            
            // Mostrar respuesta
            const formattedJson = JSON.stringify(httpResponse, null, 2);
            apiSimulatorResult.innerHTML = `<pre><code>${escapeHtml(formattedJson)}</code></pre>`;
            
            // Agregar código de uso para test
            apiSimulatorResult.innerHTML += `
                <div class="mt-3">
                    <h4>Código para prueba:</h4>
                    <pre><code>// Ejemplo de test con Jest/SuperTest
test('${endpoint} should return ${statusCode}', async () => {
  const response = await request(app).get('${endpoint}');
  expect(response.status).toBe(${statusCode});
  expect(response.body).toMatchObject(${JSON.stringify(response, null, 2)});
});</code></pre>
                </div>
            `;
            
            // Añadir un botón para copiar el código generado
            apiSimulatorResult.innerHTML += `
                <button class="tool-btn mt-3 copy-btn" onclick="copyToClipboard(this)">
                    <i class="fas fa-copy"></i> Copiar código
                </button>
            `;
        }, delayTime);
    });
}

// Framework Converter - Asegurarnos que no recarga la página
function initFrameworkConverter() {
    const frameworkConverterForm = document.getElementById('framework-converter-form');
    const frameworkConverterResult = document.getElementById('framework-converter-result');
    
    if (!frameworkConverterForm || !frameworkConverterResult) return;
    
    console.log("Formulario del Conversor de Frameworks encontrado, añadiendo event listener");
    
    // Clonar el formulario para eliminar cualquier event listener anterior
    const newForm = frameworkConverterForm.cloneNode(true);
    frameworkConverterForm.parentNode.replaceChild(newForm, frameworkConverterForm);
    
    newForm.addEventListener('submit', function(e) {
        // IMPORTANTE: Prevenir la recarga de la página
        e.preventDefault();
        console.log("Formulario de Conversor de Frameworks enviado - evento prevenido");
        
        const sourceCode = document.getElementById('source-code').value.trim();
        const fromFramework = document.getElementById('from-framework').value;
        const toFramework = document.getElementById('to-framework').value;
        
        if (!sourceCode) {
            frameworkConverterResult.innerHTML = '<p class="text-danger">Por favor ingresa código para convertir</p>';
            return;
        }
        
        // Verificar que los frameworks sean diferentes
        if (fromFramework === toFramework) {
            frameworkConverterResult.innerHTML = '<p class="text-warning">Los frameworks de origen y destino son iguales. Por favor selecciona frameworks diferentes.</p>';
            return;
        }
        
        // Convertir código según los frameworks seleccionados
        let convertedCode = '';
        let languageClass = 'javascript';
        
        try {
            if (fromFramework === 'selenium' && toFramework === 'cypress') {
                convertedCode = convertSeleniumToCypress(sourceCode);
            } else if (fromFramework === 'selenium-python' && toFramework === 'cypress') {
                convertedCode = convertSeleniumPythonToCypress(sourceCode);
                languageClass = 'javascript';
            } else if (fromFramework === 'cypress' && toFramework === 'selenium') {
                convertedCode = convertCypressToSelenium(sourceCode);
                languageClass = 'java';
            } else if (fromFramework === 'cypress' && toFramework === 'selenium-python') {
                convertedCode = convertCypressToSeleniumPython(sourceCode);
                languageClass = 'python';
            } else if (fromFramework === 'selenium' && toFramework === 'playwright') {
                convertedCode = convertSeleniumToPlaywright(sourceCode);
            } else if (fromFramework === 'selenium-python' && toFramework === 'playwright') {
                convertedCode = convertSeleniumPythonToPlaywright(sourceCode);
                languageClass = 'javascript';
            } else if (fromFramework === 'playwright' && toFramework === 'selenium') {
                convertedCode = convertPlaywrightToSelenium(sourceCode);
                languageClass = 'java';
            } else if (fromFramework === 'playwright' && toFramework === 'selenium-python') {
                convertedCode = convertPlaywrightToSeleniumPython(sourceCode);
                languageClass = 'python';
            } else {
                convertedCode = '// La conversión de ' + fromFramework + ' a ' + toFramework + ' no está implementada completamente.\n\n// Código original:\n' + sourceCode;
            }
            
            // Mostrar el resultado con formato de código
            frameworkConverterResult.innerHTML = `<pre class="code-block"><code class="language-${languageClass}">${escapeHtml(convertedCode)}</code></pre>`;
            
            // Añadir botón para copiar el código convertido
            frameworkConverterResult.innerHTML += `
                <button class="tool-btn mt-3 copy-btn" onclick="copyToClipboard(this)">
                    <i class="fas fa-copy"></i> Copiar código
                </button>
            `;
            
            // Resaltar sintaxis si existe una librería como highlight.js
            if (typeof hljs !== 'undefined') {
                document.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }
        } catch (error) {
            frameworkConverterResult.innerHTML = `<p class="text-danger">Error en la conversión: ${error.message}</p>`;
        }
    });
}

// Modificar la función initAutomationTools para incluir todas las inicializaciones
function initAutomationTools() {
    console.log("Inicializando herramientas de automatización...");
    
    // Inicializar herramientas de Web Automation
    initSelectorGenerator();
    
    // Inicializar el Generador de Requests para API
    initRequestGenerator();
    
    // Inicializar el Simulador de Pruebas de API
    initApiSimulator();
    
    // Inicializar la calculadora de esperas directamente en la sección de automatización
    initWaitCalculator();
    
    // Inicializar el conversor de frameworks
    initFrameworkConverter();
    
    console.log("Todas las herramientas de automatización han sido inicializadas correctamente");
}

// Hacer que la nueva función copySelectorsToClipboard sea accesible globalmente
window.copySelectorsToClipboard = copySelectorsToClipboard;

// Hacer que la función copyToClipboard sea accesible globalmente
window.copyToClipboard = copyToClipboard;

// Función para escapar HTML y prevenir inyección de código
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Generador de Datos de Prueba
function initTestDataGenerator() {
    const testDataForm = document.getElementById('test-data-generator-form');
    const testDataResult = document.getElementById('test-data-generator-result');

    if (!testDataForm || !testDataResult) return;

    console.log("Formulario del Generador de Datos de Prueba encontrado, añadiendo event listener");

    // Clonar el formulario para eliminar cualquier event listener anterior
    const newForm = testDataForm.cloneNode(true);
    testDataForm.parentNode.replaceChild(newForm, testDataForm);

    newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log("Formulario de Generador de Datos de Prueba enviado - evento prevenido");

        const dataTypes = [];
        document.querySelectorAll('.data-types input[type="checkbox"]:checked').forEach(cb => {
            dataTypes.push(cb.value);
        });

        const dataCount = parseInt(document.getElementById('data-count').value, 10);
        const dataFormat = document.getElementById('data-format').value;

        if (dataTypes.length === 0 || isNaN(dataCount) || dataCount <= 0) {
            testDataResult.innerHTML = '<p class="text-danger">Por favor selecciona al menos un tipo de dato y una cantidad válida</p>';
            return;
        }

        const records = [];
        for (let i = 0; i < dataCount; i++) {
            const record = {};
            dataTypes.forEach(type => {
                record[type] = generateTestData(type);
            });
            records.push(record);
        }

        let resultHTML = '';
        switch (dataFormat) {
            case 'json':
                resultHTML = `<pre><code>${JSON.stringify(records, null, 2)}</code></pre>`;
                break;
            case 'csv':
                const headers = dataTypes.join(',');
                const rows = records.map(record => dataTypes.map(type => record[type]).join(',')).join('\n');
                resultHTML = `<pre><code>${headers}\n${rows}</code></pre>`;
                break;
            case 'sql':
                const tableName = 'test_data';
                resultHTML = `<pre><code>${records.map(record => {
                    const columns = Object.keys(record).join(', ');
                    const values = Object.values(record).map(v => `'${v}'`).join(', ');
                    return `INSERT INTO ${tableName} (${columns}) VALUES (${values});`;
                }).join('\n')}</code></pre>`;
                break;
            case 'xml':
                const xmlRows = records.map(record => {
                    const fields = Object.entries(record)
                        .map(([key, value]) => `    <${key}>${value}</${key}>`)
                        .join('\n');
                    return `  <record>\n${fields}\n  </record>`;
                }).join('\n');
                resultHTML = `<pre><code><?xml version="1.0" encoding="UTF-8"?>\n<data>\n${xmlRows}\n</data></code></pre>`;
                break;
        }

        testDataResult.innerHTML = resultHTML;

        // Añadir botón para copiar
        testDataResult.innerHTML += `
            <button class="tool-btn mt-3 copy-btn" onclick="copyToClipboard(this)">
                <i class="fas fa-copy"></i> Copiar datos
            </button>
        `;
    });
   
    function generateTestData(type) {
        try {
            // Usar la función de verificación
            const generator = window.checkDataGenerator();
            return generator.generate(type);
        } catch (error) {
            console.error('Error al generar datos:', error);
            return 'Error: ' + error.message;
        }
    }
}

// Generador de Plan de Pruebas
function initTestPlanGenerator() {
    const testPlanForm = document.getElementById('test-plan-generator-form');
    const testPlanResult = document.getElementById('test-plan-generator-result');

    if (!testPlanForm || !testPlanResult) return;

    console.log("Formulario del Generador de Plan de Pruebas encontrado, añadiendo event listener");

    // Clonar el formulario para eliminar cualquier event listener anterior
    const newForm = testPlanForm.cloneNode(true);
    testPlanForm.parentNode.replaceChild(newForm, testPlanForm);

    newForm.addEventListener('submit', function(e) {
        // Prevenir la recarga de la página
        e.preventDefault();
        console.log("Formulario de Generador de Plan de Pruebas enviado - evento prevenido");

        const planSections = [];
        document.querySelectorAll('.plan-sections input[type="checkbox"]:checked').forEach(cb => {
            planSections.push(cb.value);
        });

        if (planSections.length === 0) {
            testPlanResult.innerHTML = '<p class="text-danger">Por favor selecciona al menos una sección del plan</p>';
            return;
        }

        let resultHTML = '<h4>Plan de Pruebas Generado:</h4><ul>';
        planSections.forEach(section => {
            resultHTML += `<li>${generatePlanSection(section)}</li>`;
        });
        resultHTML += '</ul>';

        testPlanResult.innerHTML = resultHTML;
    });

    function generatePlanSection(section) {
        switch (section) {
            case 'scope': return 'Definición del alcance del proyecto.';
            case 'strategy': return 'Estrategia de pruebas basada en metodologías ágiles.';
            case 'schedule': return 'Cronograma detallado de actividades.';
            case 'resources': return 'Lista de recursos necesarios para las pruebas.';
            case 'risks': return 'Identificación y mitigación de riesgos.';
            case 'cases': return 'Conjunto de casos de prueba diseñados.';
            default: return 'Sección desconocida';
        }
    }
}

// Nueva función para manejar la generación de datos de carga
function generarDatosCarga(event) {
    event.preventDefault();
    const tipo = document.getElementById('tipo-dato-carga').value;
    const cantidad = parseInt(document.getElementById('cantidad-datos-carga').value);
    const listaDatos = document.getElementById('lista-datos-carga');

    // Validar que el select existe y tiene un valor válido
    if (!tipo || !['usuarios', 'transacciones', 'productos', 'pedidos'].includes(tipo)) {
        listaDatos.innerHTML = '<p class="error">Error: Tipo de dato no válido</p>';
        return;
    }

    // Mostrar indicador de progreso
    listaDatos.innerHTML = '<div class="progress-bar">Generando datos...</div>';

    try {
        const datos = [];
        for (let i = 0; i < cantidad; i++) {
            let dato;
            switch (tipo) {
                case 'usuarios':
                    dato = {
                        id: faker.random.uuid(),
                        nombre: faker.name.findName(),
                        email: faker.internet.email(),
                        rol: faker.random.arrayElement(['admin', 'usuario', 'editor']),
                        fechaRegistro: faker.date.past().toISOString(),
                        activo: faker.random.boolean()
                    };
                    break;

                case 'transacciones':
                    dato = {
                        id: faker.random.uuid(),
                        monto: parseFloat(faker.commerce.price()),
                        tipo: faker.random.arrayElement(['ingreso', 'egreso', 'transferencia']),
                        fecha: faker.date.recent().toISOString(),
                        estado: faker.random.arrayElement(['completada', 'pendiente', 'cancelada']),
                        referencia: faker.finance.account()
                    };
                    break;

                case 'productos':
                    dato = {
                        id: faker.random.uuid(),
                        nombre: faker.commerce.productName(),
                        precio: parseFloat(faker.commerce.price()),
                        categoria: faker.commerce.department(),
                        stock: faker.random.number({ min: 0, max: 1000 }),
                        proveedor: faker.company.companyName()
                    };
                    break;

                case 'pedidos':
                    dato = {
                        id: faker.random.uuid(),
                        cliente: faker.name.findName(),
                        productos: Array.from({ length: faker.random.number({ min: 1, max: 5 }) }, () => ({
                            nombre: faker.commerce.productName(),
                            cantidad: faker.random.number({ min: 1, max: 10 }),
                            precio: parseFloat(faker.commerce.price())
                        })),
                        total: parseFloat(faker.commerce.price()),
                        estado: faker.random.arrayElement(['nuevo', 'procesando', 'enviado', 'entregado'])
                    };
                    break;
            }
            datos.push(dato);
        }

        // Mostrar resultados
        mostrarResultadosDatosCarga(datos, listaDatos);

    } catch (error) {
        console.error('Error al generar datos:', error);
        listaDatos.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

function mostrarResultadosDatosCarga(datos, contenedor) {
    const panel = `
        <div class="results-panel">
            <div class="results-header">
                <h4>Datos Generados (${datos.length} registros)</h4>
                <div class="results-actions">
                    <button onclick="descargarDatosCarga('json')" class="tool-btn">JSON</button>
                    <button onclick="descargarDatosCarga('csv')" class="tool-btn">CSV</button>
                    <button onclick="descargarDatosCarga('sql')" class="tool-btn">SQL</button>
                </div>
            </div>
            <div class="results-preview">
                <pre><code>${JSON.stringify(datos.slice(0, 5), null, 2)}</code></pre>
            </div>
            <div class="results-summary">
                <p>Mostrando 5 de ${datos.length} registros</p>
                <p>Tamaño total: ${Math.round(JSON.stringify(datos).length / 1024)} KB</p>
            </div>
        </div>
    `;

    contenedor.innerHTML = panel;
    window.datosCargaGenerados = datos;
}

function descargarDatosCarga(formato) {
    if (!window.datosCargaGenerados) return;
    
    let contenido;
    let tipo;
    let extension;
    
    switch (formato) {
        case 'json':
            contenido = JSON.stringify(window.datosCargaGenerados, null, 2);
            tipo = 'application/json';
            extension = 'json';
            break;
        case 'csv':
            contenido = convertirDatosACsv(window.datosCargaGenerados);
            tipo = 'text/csv';
            extension = 'csv';
            break;
        case 'sql':
            contenido = convertirDatosASql(window.datosCargaGenerados);
            tipo = 'text/plain';
            extension = 'sql';
            break;
    }
    
    const blob = new Blob([contenido], { type: tipo });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `datos_carga.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function convertirDatosACsv(datos) {
    if (datos.length === 0) return '';
    
    const headers = Object.keys(datos[0]);
    const rows = [headers.join(',')];
    
    for (const dato of datos) {
        const values = headers.map(header => {
            const val = dato[header];
            return typeof val === 'string' ? `"${val}"` : val;
        });
        rows.push(values.join(','));
    }
    
    return rows.join('\n');
}

function convertirDatosASql(datos) {
    if (datos.length === 0) return '';
    
    const tableName = 'datos_carga';
    const headers = Object.keys(datos[0]);
    const rows = [];
    
    for (const dato of datos) {
        const values = headers.map(header => {
            const val = dato[header];
            return typeof val === 'string' ? `'${val}'` : val;
        });
        rows.push(
            `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES (${values.join(', ')});`
        );
    }
    
    return rows.join('\n');
}

// Hacer las funciones accesibles globalmente
window.generarDatosCarga = generarDatosCarga;
window.descargarDatosCarga = descargarDatosCarga;
