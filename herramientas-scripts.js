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
});

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
