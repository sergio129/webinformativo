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
