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

// Modificar la función initTimeTools para que verifique y corrija el DOM si es necesario
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

// Función para inicializar todas las herramientas de tiempo
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
    
    selectorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
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

// 2. Generador de Requests para API
function initRequestGenerator() {
    const requestForm = document.getElementById('request-generator-form');
    const requestResult = document.getElementById('request-generator-result');
    
    if (!requestForm || !requestResult) return;
    
    requestForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
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
        
        requestResult.innerHTML = `<pre><code>${code}</code></pre>`;
    });
    
    // Funciones para generar código
    function generateRestAssuredCode(method, url, headers, body) {
        let code = 'import io.restassured.RestAssured;\n';
        code += 'import static io.restassured.RestAssured.*;\n';
        code += 'import static io.restassured.matcher.RestAssuredMatchers.*;\n';
        code += 'import static org.hamcrest.Matchers.*;\n\n';
        
        code += 'public class APITest {\n';
        code += '    public void testAPI() {\n';
        
        code += `        given()\n`;
        
        // Headers
        if (headers && Object.keys(headers).length > 0) {
            code += '            // Headers\n';
            for (const [key, value] of Object.entries(headers)) {
                code += `            .header("${key}", "${value}")\n`;
            }
        }
        
        // Body
        if (body) {
            code += '            // Body\n';
            code += `            .body(${JSON.stringify(body, null, 4)})\n`;
        }
        
        code += `        .when()\n`;
        code += `            .${method.toLowerCase()}("${url}")\n`;
        code += `        .then()\n`;
        code += `            .statusCode(200);\n`;
        code += '    }\n';
        code += '}';
        
        return code;
    }
    
    function generateRequestsCode(method, url, headers, body) {
        let code = 'import requests\n\n';
        code += `# ${method} request to ${url}\n`;
        
        // Headers
        if (headers && Object.keys(headers).length > 0) {
            code += 'headers = ' + JSON.stringify(headers, null, 4) + '\n\n';
        } else {
            code += 'headers = {}\n\n';
        }
        
        // Body
        if (body) {
            code += 'payload = ' + JSON.stringify(body, null, 4) + '\n\n';
        }
        
        code += `response = requests.${method.toLowerCase()}(\n`;
        code += `    "${url}",\n`;
        
        if (headers && Object.keys(headers).length > 0) {
            code += '    headers=headers,\n';
        }
        
        if (body) {
            code += '    json=payload\n';
        }
        
        code += ')\n\n';
        code += '# Verificar respuesta\n';
        code += 'print(response.status_code)\n';
        code += 'print(response.json())\n';
        
        return code;
    }
    
    function generateFetchCode(method, url, headers, body) {
        let code = '// Usando Fetch API\n';
        
        // Headers
        if (headers && Object.keys(headers).length > 0) {
            code += 'const headers = ' + JSON.stringify(headers, null, 4) + ';\n\n';
        } else {
            code += 'const headers = {};\n\n';
        }
        
        // Body
        if (body) {
            code += 'const payload = ' + JSON.stringify(body, null, 4) + ';\n\n';
        }
        
        code += 'fetch("' + url + '", {\n';
        code += '    method: "' + method + '",\n';
        
        if (headers && Object.keys(headers).length > 0) {
            code += '    headers: headers,\n';
        }
        
        if (body) {
            code += '    body: JSON.stringify(payload)\n';
        }
        
        code += '})\n';
        code += '.then(response => response.json())\n';
        code += '.then(data => console.log(data))\n';
        code += '.catch(error => console.error("Error:", error));\n';
        
        return code;
    }
    
    function generatePostmanCode(method, url, headers, body) {
        let code = 'pm.sendRequest({\n';
        code += `    url: "${url}",\n`;
        code += `    method: "${method}",\n`;
        
        if (headers && Object.keys(headers).length > 0) {
            code += '    header: ' + JSON.stringify(headers, null, 4) + ',\n';
        }
        
        if (body) {
            code += '    body: {\n';
            code += '        mode: "raw",\n';
            code += '        raw: JSON.stringify(' + JSON.stringify(body, null, 4) + '),\n';
            code += '        options: {\n';
            code += '            raw: {\n';
            code += '                language: "json"\n';
            code += '            }\n';
            code += '        }\n';
            code += '    }\n';
        }
        
        code += '}, function(err, response) {\n';
        code += '    if (err) {\n';
        code += '        console.log(err);\n';
        code += '    } else {\n';
        code += '        pm.test("Status code is 200", function() {\n';
        code += '            pm.response.to.have.status(200);\n';
        code += '        });\n';
        code += '        \n';
        code += '        const responseJson = response.json();\n';
        code += '        console.log(responseJson);\n';
        code += '    }\n';
        code += '});\n';
        
        return code;
    }
}

// 3. Inicializar el Simulador de Pruebas de API
function initApiSimulator() {
    const apiSimulatorForm = document.getElementById('api-simulator-form');
    const apiSimulatorResult = document.getElementById('api-simulator-result');
    const responseTypeSelect = document.getElementById('response-type');
    const customResponseGroup = document.querySelector('.custom-response-group');
    const delayTimeInput = document.getElementById('delay-time');
    const delayValueDisplay = document.getElementById('delay-value');
    
    if (!apiSimulatorForm || !apiSimulatorResult) return;
    
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
    
    // Manejar envío del formulario
    apiSimulatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const endpoint = document.getElementById('api-endpoint').value.trim();
        const statusCode = document.getElementById('response-status').value;
        const responseType = responseTypeSelect.value;
        const delayTime = parseInt(delayTimeInput.value);
        
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
            apiSimulatorResult.innerHTML = `<pre><code>${formattedJson}</code></pre>`;
            
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
        }, delayTime);
    });
    
    // Función para obtener texto de estado según código
    function getStatusText(code) {
        const statusTexts = {
            '200': 'OK',
            '201': 'Created',
            '400': 'Bad Request',
            '401': 'Unauthorized',
            '403': 'Forbidden',
            '404': 'Not Found',
            '500': 'Internal Server Error'
        };
        return statusTexts[code] || 'Unknown Status';
    }
    
    // Función para generar respuesta simulada
    function generateMockResponse(endpoint, type, statusCode) {
        const isError = parseInt(statusCode) >= 400;
        
        // Respuesta base según el tipo
        switch (type) {
            case 'success':
                if (endpoint.includes('user')) {
                    return {
                        id: 123,
                        username: 'testuser',
                        email: 'user@example.com',
                        name: 'Test User',
                        createdAt: new Date().toISOString()
                    };
                } else {
                    return {
                        success: true,
                        message: 'Operación completada exitosamente',
                        timestamp: new Date().toISOString()
                    };
                }
            
            case 'error':
                if (statusCode === '400') {
                    return {
                        error: 'Bad Request',
                        message: 'Parámetros de solicitud inválidos',
                        details: [
                            'El campo "email" es requerido',
                            'El valor de "age" debe ser un número'
                        ]
                    };
                } else if (statusCode === '401') {
                    return {
                        error: 'Unauthorized',
                        message: 'Autenticación requerida para acceder a este recurso'
                    };
                } else if (statusCode === '404') {
                    return {
                        error: 'Not Found',
                        message: `Recurso no encontrado: ${endpoint}`
                    };
                } else {
                    return {
                        error: 'Error',
                        message: 'Ocurrió un error al procesar la solicitud',
                        status: parseInt(statusCode)
                    };
                }
            
            case 'empty':
                return {};
            
            case 'pagination':
                return {
                    page: 1,
                    perPage: 10,
                    total: 42,
                    totalPages: 5,
                    data: Array(10).fill(null).map((_, i) => ({
                        id: i + 1,
                        name: `Item ${i + 1}`,
                        description: `Descripción del ítem ${i + 1}`
                    }))
                };
            
            default:
                return {
                    message: 'Respuesta simulada generada por QualiTest API Simulator'
                };
        }
    }
}

// Herramienta de conversión entre frameworks
const frameworkConverterForm = document.getElementById('framework-converter-form');
if (frameworkConverterForm) {
    frameworkConverterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const result = document.getElementById('framework-converter-result');
        if (result) {
            const sourceCode = document.getElementById('source-code').value.trim();
            const fromFramework = document.getElementById('from-framework').value;
            const toFramework = document.getElementById('to-framework').value;
            
            if (!sourceCode) {
                result.innerHTML = '<p class="text-danger">Por favor ingresa código para convertir</p>';
                return;
            }
            
            // Verificar que los frameworks sean diferentes
            if (fromFramework === toFramework) {
                result.innerHTML = '<p class="text-warning">Los frameworks de origen y destino son iguales. Por favor selecciona frameworks diferentes.</p>';
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
                result.innerHTML = `<pre class="code-block"><code class="language-${languageClass}">${escapeHtml(convertedCode)}</code></pre>`;
                
                // Añadir botón para copiar el código convertido
                result.innerHTML += `
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
                result.innerHTML = `<p class="text-danger">Error en la conversión: ${error.message}</p>`;
            }
        }
    });
}

// 4. Inicialización de herramientas de automatización
function initAutomationTools() {
    console.log("Inicializando herramientas de automatización...");
    
    // Inicializar herramientas de Web Automation
    initSelectorGenerator();
    
    // Herramienta de conversión entre frameworks
    const frameworkConverterForm = document.getElementById('framework-converter-form');
    if (frameworkConverterForm) {
        frameworkConverterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const result = document.getElementById('framework-converter-result');
            if (result) {
                const sourceCode = document.getElementById('source-code').value.trim();
                const fromFramework = document.getElementById('from-framework').value;
                const toFramework = document.getElementById('to-framework').value;
                
                if (!sourceCode) {
                    result.innerHTML = '<p class="text-danger">Por favor ingresa código para convertir</p>';
                    return;
                }
                
                // Verificar que los frameworks sean diferentes
                if (fromFramework === toFramework) {
                    result.innerHTML = '<p class="text-warning">Los frameworks de origen y destino son iguales. Por favor selecciona frameworks diferentes.</p>';
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
                    result.innerHTML = `<pre><code class="language-${languageClass}">${escapeHtml(convertedCode)}</code></pre>`;
                    
                    // Añadir botón para copiar el código convertido
                    result.innerHTML += `
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
                    result.innerHTML = `<p class="text-danger">Error en la conversión: ${error.message}</p>`;
                }
            }
        });
    }
    
    // ...existing code for other tools...
}

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

// Función para copiar al portapapeles
function copyToClipboard(button) {
    const codeBlock = button.parentElement.querySelector('code');
    const text = codeBlock.textContent;
    
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

// Funciones de conversión de código

// Conversión de Selenium (Java) a Cypress
function convertSeleniumToCypress(seleniumCode) {
    let cypressCode = seleniumCode;
    
    // Reemplazar anotaciones y declaraciones de clase/método Java
    cypressCode = cypressCode.replace(/@Test|public\s+void\s+\w+\(\)|\{|\}|public\s+class\s+\w+|import.*;|package.*;/g, '');
    
    // Reemplazar aserciones Java
    cypressCode = cypressCode.replace(/Assert\.assertEquals\(([^,]+),\s*([^)]+)\);/g, 'expect($2).to.equal($1);');
    cypressCode = cypressCode.replace(/Assert\.assertTrue\(([^)]+)\);/g, 'expect($1).to.be.true;');
    cypressCode = cypressCode.replace(/Assert\.assertFalse\(([^)]+)\);/g, 'expect($1).to.be.false;');
    cypressCode = cypressCode.replace(/Assert\.assertNull\(([^)]+)\);/g, 'expect($1).to.be.null;');
    cypressCode = cypressCode.replace(/Assert\.assertNotNull\(([^)]+)\);/g, 'expect($1).to.not.be.null;');
    
    // Reemplazar tiempos de espera
    cypressCode = cypressCode.replace(/Thread\.sleep\((\d+)\);/g, 'cy.wait($1);');
    
    // Configuración del WebDriver a configuración de Cypress
    cypressCode = cypressCode.replace(/WebDriver\s+\w+\s*=\s*new\s+ChromeDriver\(\);/, '// Cypress maneja el navegador automáticamente');
    cypressCode = cypressCode.replace(/driver\.manage\(\)\.window\(\)\.maximize\(\);/, '// Cypress maneja el tamaño de la ventana automáticamente');
    
    // Reemplazar navegación
    cypressCode = cypressCode.replace(/driver\.get\("([^"]+)"\);/g, "cy.visit('$1');");
    cypressCode = cypressCode.replace(/driver\.navigate\(\)\.to\("([^"]+)"\);/g, "cy.visit('$1');");
    cypressCode = cypressCode.replace(/driver\.navigate\(\)\.back\(\);/g, "cy.go('back');");
    cypressCode = cypressCode.replace(/driver\.navigate\(\)\.forward\(\);/g, "cy.go('forward');");
    cypressCode = cypressCode.replace(/driver\.navigate\(\)\.refresh\(\);/g, "cy.reload();");
    
    // Reemplazar cierre de navegador
    cypressCode = cypressCode.replace(/driver\.close\(\);|driver\.quit\(\);/, '// Cypress cierra el navegador automáticamente');
    
    // Reemplazar selectores y acciones
    cypressCode = cypressCode.replace(/driver\.findElement\(By\.id\("([^"]+)"\)\)/g, "cy.get('#$1')");
    cypressCode = cypressCode.replace(/driver\.findElement\(By\.className\("([^"]+)"\)\)/g, "cy.get('.$1')");
    cypressCode = cypressCode.replace(/driver\.findElement\(By\.name\("([^"]+)"\)\)/g, "cy.get('[name=\"$1\"]')");
    cypressCode = cypressCode.replace(/driver\.findElement\(By\.tagName\("([^"]+)"\)\)/g, "cy.get('$1')");
    cypressCode = cypressCode.replace(/driver\.findElement\(By\.linkText\("([^"]+)"\)\)/g, "cy.contains('$1')");
    cypressCode = cypressCode.replace(/driver\.findElement\(By\.partialLinkText\("([^"]+)"\)\)/g, "cy.contains('$1')");
    cypressCode = cypressCode.replace(/driver\.findElement\(By\.xpath\("([^"]+)"\)\)/g, "cy.xpath('$1')");
    cypressCode = cypressCode.replace(/driver\.findElement\(By\.cssSelector\("([^"]+)"\)\)/g, "cy.get('$1')");
    
    // Reemplazar findElements para listas
    cypressCode = cypressCode.replace(/driver\.findElements\(By\.id\("([^"]+)"\)\)/g, "cy.get('#$1')");
    cypressCode = cypressCode.replace(/driver\.findElements\(By\.className\("([^"]+)"\)\)/g, "cy.get('.$1')");
    cypressCode = cypressCode.replace(/driver\.findElements\(By\.name\("([^"]+)"\)\)/g, "cy.get('[name=\"$1\"]')");
    cypressCode = cypressCode.replace(/driver\.findElements\(By\.tagName\("([^"]+)"\)\)/g, "cy.get('$1')");
    cypressCode = cypressCode.replace(/driver\.findElements\(By\.xpath\("([^"]+)"\)\)/g, "cy.xpath('$1')");
    cypressCode = cypressCode.replace(/driver\.findElements\(By\.cssSelector\("([^"]+)"\)\)/g, "cy.get('$1')");
    
    // Reemplazar acciones
    cypressCode = cypressCode.replace(/\.click\(\);/g, '.click();');
    cypressCode = cypressCode.replace(/\.clear\(\);/g, '.clear();');
    cypressCode = cypressCode.replace(/\.sendKeys\("([^"]+)"\);/g, ".type('$1');");
    cypressCode = cypressCode.replace(/\.getText\(\)/g, '.invoke("text")');
    cypressCode = cypressCode.replace(/\.getAttribute\("([^"]+)"\)/g, '.invoke("attr", "$1")');
    cypressCode = cypressCode.replace(/\.isDisplayed\(\)/g, '.should("be.visible")');
    cypressCode = cypressCode.replace(/\.isEnabled\(\)/g, '.should("be.enabled")');
    cypressCode = cypressCode.replace(/\.isSelected\(\)/g, '.should("be.checked")');
    
    // Reemplazar Select para dropdown
    cypressCode = cypressCode.replace(/Select\s+\w+\s*=\s*new\s+Select\(([^)]+)\);/g, '// Cypress maneja los dropdowns directamente');
    cypressCode = cypressCode.replace(/\w+\.selectByVisibleText\("([^"]+)"\);/g, ".select('$1');");
    cypressCode = cypressCode.replace(/\w+\.selectByValue\("([^"]+)"\);/g, ".select('$1');");
    cypressCode = cypressCode.replace(/\w+\.selectByIndex\((\d+)\);/g, (_, index) => `.select(${parseInt(index) + 1});`);
    
    // Reemplazar capturas de pantalla
    cypressCode = cypressCode.replace(
        /((TakesScreenshot).*\.getScreenshotAs.*|.*\.takeScreenshot\(\).*);/g,
        "cy.screenshot('screenshot');"
    );
    
    // Limpiar líneas vacías múltiples
    cypressCode = cypressCode.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Formatear como test de Cypress
    cypressCode = `describe('Converted Selenium Test', () => {
  it('should perform the test steps', () => {
${cypressCode.split('\n').map(line => line.trim() ? '    ' + line : '').join('\n')}
  });
});`;
    
    return cypressCode;
}

// Conversión de Cypress a Selenium (Java)
function convertCypressToSelenium(cypressCode) {
    let seleniumCode = 'import org.openqa.selenium.By;\n';
    seleniumCode += 'import org.openqa.selenium.WebDriver;\n';
    seleniumCode += 'import org.openqa.selenium.WebElement;\n';
    seleniumCode += 'import org.openqa.selenium.chrome.ChromeDriver;\n';
    seleniumCode += 'import org.openqa.selenium.support.ui.ExpectedConditions;\n';
    seleniumCode += 'import org.openqa.selenium.support.ui.WebDriverWait;\n';
    seleniumCode += 'import org.junit.Assert;\n';
    seleniumCode += 'import java.time.Duration;\n\n';
    
    seleniumCode += 'public class ConvertedCypressTest {\n';
    seleniumCode += '    public void testMethod() {\n';
    seleniumCode += '        WebDriver driver = new ChromeDriver();\n';
    seleniumCode += '        try {\n';
    
    // Reemplazar navegación
    let transformedCode = cypressCode.replace(/cy\.visit\(['"]([^'"]+)['"]\);/g, 'driver.get("$1");');
    
    // Reemplazar selectores y acciones
    transformedCode = transformedCode.replace(/cy\.get\(['"]#([^'"]+)['"]\)/g, 'driver.findElement(By.id("$1"))');
    transformedCode = transformedCode.replace(/cy\.get\(['"]\\.([^'"]+)['"]\)/g, 'driver.findElement(By.className("$1"))');
    transformedCode = transformedCode.replace(/cy\.get\(['"]\[name=['"]([^'"]+)['"]\]['"]\)/g, 'driver.findElement(By.name("$1"))');
    transformedCode = transformedCode.replace(/cy\.get\(['"]([^#\.\[])[^'"]*['"]\)/g, (match, firstChar) => {
        // Si el selector comienza con un tag name
        if (/^[a-zA-Z]/.test(firstChar)) {
            return match.replace(/cy\.get\(['"]([^'"]+)['"]\)/g, 'driver.findElement(By.cssSelector("$1"))');
        }
        return match;
    });
    transformedCode = transformedCode.replace(/cy\.contains\(['"]([^'"]+)['"]\)/g, 'driver.findElement(By.xpath("//*[contains(text(),\'$1\')]"))');
    
    // Reemplazar acciones
    transformedCode = transformedCode.replace(/\.click\(\);/g, '.click();');
    transformedCode = transformedCode.replace(/\.clear\(\);/g, '.clear();');
    transformedCode = transformedCode.replace(/\.type\(['"]([^'"]+)['"]\);/g, '.sendKeys("$1");');
    transformedCode = transformedCode.replace(/\.check\(\);/g, '.click();');
    transformedCode = transformedCode.replace(/\.uncheck\(\);/g, '.click();');
    
    // Reemplazar aserciones
    transformedCode = transformedCode.replace(/expect\(([^)]+)\)\.to\.equal\(([^)]+)\);/g, 'Assert.assertEquals($2, $1);');
    transformedCode = transformedCode.replace(/expect\(([^)]+)\)\.to\.be\.true;/g, 'Assert.assertTrue($1);');
    transformedCode = transformedCode.replace(/expect\(([^)]+)\)\.to\.be\.false;/g, 'Assert.assertFalse($1);');
    
    // Reemplazar esperas
    transformedCode = transformedCode.replace(/cy\.wait\((\d+)\);/g, 'Thread.sleep($1);');
    
    // Reemplazar reload, back, forward
    transformedCode = transformedCode.replace(/cy\.reload\(\);/g, 'driver.navigate().refresh();');
    transformedCode = transformedCode.replace(/cy\.go\('back'\);/g, 'driver.navigate().back();');
    transformedCode = transformedCode.replace(/cy\.go\('forward'\);/g, 'driver.navigate().forward();');
    
    // Reemplazar aserciones de visibilidad
    transformedCode = transformedCode.replace(/\.should\(['"]be\.visible['"]\)/g, '.isDisplayed()');
    transformedCode = transformedCode.replace(/\.should\(['"]be\.enabled['"]\)/g, '.isEnabled()');
    transformedCode = transformedCode.replace(/\.should\(['"]be\.checked['"]\)/g, '.isSelected()');
    
    // Reemplazar selectores para dropdowns
    transformedCode = transformedCode.replace(/\.select\(['"]([^'"]+)['"]\);/g, (match, value) => {
        return `.click();\n        new org.openqa.selenium.support.ui.Select(driver.findElement(By.xpath("//option[text()=\\'${value}\\']"))).selectByVisibleText("${value}");`;
    });
    
    // Reemplazar capturas de pantalla
    transformedCode = transformedCode.replace(/cy\.screenshot\(['"](.*)['"]\);/g, 
        'org.openqa.selenium.OutputType.FILE screenshot = ((org.openqa.selenium.TakesScreenshot)driver).getScreenshotAs(org.openqa.selenium.OutputType.FILE);\n' +
        '        // Guardar captura en un archivo');
    
    // Eliminar bloques describe e it de Cypress
    transformedCode = transformedCode.replace(/describe\(['"][^'"]+['"],\s*\(\)\s*=>\s*\{|\}\);$|it\(['"][^'"]+['"],\s*\(\)\s*=>\s*\{|\}\);/g, '');
    
    // Agregar indentación adecuada
    const indentedCode = transformedCode
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => '        ' + line.trim())
        .join('\n');
    
    seleniumCode += indentedCode + '\n';
    seleniumCode += '        } finally {\n';
    seleniumCode += '            driver.quit();\n';
    seleniumCode += '        }\n';
    seleniumCode += '    }\n';
    seleniumCode += '}';
    
    return seleniumCode;
}

// Conversión de Selenium Python a Cypress
function convertSeleniumPythonToCypress(seleniumPythonCode) {
    let cypressCode = '';
    
    // Reemplazar imports y configuración
    seleniumPythonCode = seleniumPythonCode.replace(/from selenium import webdriver|from selenium.webdriver.common.by import By|from selenium.webdriver.support.ui import WebDriverWait|from selenium.webdriver.support import expected_conditions as EC|import time|import unittest/g, '');
    
    // Reemplazar clase y configuración de prueba
    seleniumPythonCode = seleniumPythonCode.replace(/class\s+\w+\([\w.]+\):|def\s+setUp\(self\):|def\s+tearDown\(self\):|def\s+test_\w+\(self\):/g, '');
    
    // Reemplazar creación del driver
    seleniumPythonCode = seleniumPythonCode.replace(/self.driver\s*=\s*webdriver\.Chrome\(\)|\s*driver\s*=\s*webdriver\.Chrome\(\)/g, '// Cypress maneja el navegador automáticamente');
    
    // Reemplazar navegación
    seleniumPythonCode = seleniumPythonCode.replace(/self\.driver\.get\(['"]([^'"]+)['"]\)|driver\.get\(['"]([^'"]+)['"]\)/g, (_, url1, url2) => `cy.visit('${url1 || url2}');`);
    
    // Reemplazar selectores y acciones
    seleniumPythonCode = seleniumPythonCode.replace(/self\.driver\.find_element\(By\.ID,\s*['"]([^'"]+)['"]\)|driver\.find_element\(By\.ID,\s*['"]([^'"]+)['"]\)/g, (_, id1, id2) => `cy.get('#${id1 || id2}')`);
    seleniumPythonCode = seleniumPythonCode.replace(/self\.driver\.find_element\(By\.CLASS_NAME,\s*['"]([^'"]+)['"]\)|driver\.find_element\(By\.CLASS_NAME,\s*['"]([^'"]+)['"]\)/g, (_, cls1, cls2) => `cy.get('.${cls1 || cls2}')`);
    seleniumPythonCode = seleniumPythonCode.replace(/self\.driver\.find_element\(By\.NAME,\s*['"]([^'"]+)['"]\)|driver\.find_element\(By\.NAME,\s*['"]([^'"]+)['"]\)/g, (_, name1, name2) => `cy.get('[name="${name1 || name2}"]')`);
    seleniumPythonCode = seleniumPythonCode.replace(/self\.driver\.find_element\(By\.XPATH,\s*['"]([^'"]+)['"]\)|driver\.find_element\(By\.XPATH,\s*['"]([^'"]+)['"]\)/g, (_, xpath1, xpath2) => `cy.xpath('${xpath1 || xpath2}')`);
    seleniumPythonCode = seleniumPythonCode.replace(/self\.driver\.find_element\(By\.CSS_SELECTOR,\s*['"]([^'"]+)['"]\)|driver\.find_element\(By\.CSS_SELECTOR,\s*['"]([^'"]+)['"]\)/g, (_, css1, css2) => `cy.get('${css1 || css2}')`);
    seleniumPythonCode = seleniumPythonCode.replace(/self\.driver\.find_element\(By\.TAG_NAME,\s*['"]([^'"]+)['"]\)|driver\.find_element\(By\.TAG_NAME,\s*['"]([^'"]+)['"]\)/g, (_, tag1, tag2) => `cy.get('${tag1 || tag2}')`);
    seleniumPythonCode = seleniumPythonCode.replace(/self\.driver\.find_element\(By\.LINK_TEXT,\s*['"]([^'"]+)['"]\)|driver\.find_element\(By\.LINK_TEXT,\s*['"]([^'"]+)['"]\)/g, (_, text1, text2) => `cy.contains('${text1 || text2}')`);
    
    // Reemplazar acciones
    seleniumPythonCode = seleniumPythonCode.replace(/\.click\(\)/g, '.click()');
    seleniumPythonCode = seleniumPythonCode.replace(/\.clear\(\)/g, '.clear()');
    seleniumPythonCode = seleniumPythonCode.replace(/\.send_keys\(['"]([^'"]+)['"]\)/g, ".type('$1')");
    
    // Reemplazar aserciones
    seleniumPythonCode = seleniumPythonCode.replace(/self\.assertEqual\(([^,]+),\s*([^)]+)\)|assertEqual\(([^,]+),\s*([^)]+)\)/g, (_, val1, val2, val3, val4) => `expect(${val2 || val4}).to.equal(${val1 || val3})`);
    seleniumPythonCode = seleniumPythonCode.replace(/self\.assertTrue\(([^)]+)\)|assertTrue\(([^)]+)\)/g, (_, val1, val2) => `expect(${val1 || val2}).to.be.true`);
    seleniumPythonCode = seleniumPythonCode.replace(/self\.assertFalse\(([^)]+)\)|assertFalse\(([^)]+)\)/g, (_, val1, val2) => `expect(${val1 || val2}).to.be.false`);
    
    // Reemplazar esperas
    seleniumPythonCode = seleniumPythonCode.replace(/time\.sleep\(([^)]+)\)/g, 'cy.wait($1 * 1000)');
    
    // Eliminar self. y driver.quit
    seleniumPythonCode = seleniumPythonCode.replace(/self\.|self\.driver\.|driver\.quit\(\)/g, '');
    
    // Eliminar líneas vacías e identación incorrecta
    const cleanedCode = seleniumPythonCode
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => line.trim())
        .join('\n');
    
    // Formatear como test de Cypress
    cypressCode = `describe('Converted Selenium Python Test', () => {
  it('should perform the test steps', () => {
${cleanedCode.split('\n').map(line => line ? '    ' + line : '').join('\n')}
  });
});`;
    
    return cypressCode;
}

// ...existing code for other conversion functions...

// Hacer que la función copyToClipboard sea accesible globalmente
window.copyToClipboard = copyToClipboard;

// ...existing code...
