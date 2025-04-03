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

    // Manejar el formulario de contacto
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener los valores del formulario
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value;
            const asunto = document.getElementById('asunto').value;
            const mensaje = document.getElementById('mensaje').value;
            
            // Aquí normalmente enviarías los datos a un servidor
            // Por ahora, simularemos una respuesta exitosa
            
            // Mostrar indicador de carga (toast)
            showToast('info', 'Enviando mensaje...', 'Por favor espere mientras procesamos su solicitud.');
            
            // Simular una demora de red
            setTimeout(function() {
                // Simular éxito (en una aplicación real, esto dependería de la respuesta del servidor)
                const success = Math.random() > 0.2; // 80% de probabilidad de éxito
                
                if (success) {
                    // Mostrar mensaje de éxito
                    showToast('success', '¡Mensaje enviado!', 'Gracias por contactarnos. Nos pondremos en contacto contigo pronto.');
                    
                    // Limpiar el formulario
                    contactForm.reset();
                } else {
                    // Mostrar mensaje de error
                    showToast('error', 'Error al enviar', 'Hubo un problema al enviar tu mensaje. Por favor intenta de nuevo más tarde.');
                }
            }, 1500);
        });
    }
    
    // Función para mostrar toasts de notificación
    function showToast(type, title, message) {
        const toastContainer = document.querySelector('.toast-container');
        
        // Crear el elemento toast
        const toast = document.createElement('div');
        toast.className = `contact-toast ${type}`;
        
        // Determinar el icono según el tipo
        let icon = '';
        switch (type) {
            case 'success':
                icon = 'fas fa-check-circle';
                break;
            case 'error':
                icon = 'fas fa-exclamation-circle';
                break;
            case 'info':
                icon = 'fas fa-info-circle';
                break;
            default:
                icon = 'fas fa-info-circle';
        }
        
        // Estructura del toast
        toast.innerHTML = `
            <i class="${icon}"></i>
            <div class="contact-toast-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="contact-toast-close">&times;</button>
        `;
        
        // Agregar al contenedor
        toastContainer.appendChild(toast);
        
        // Mostrar con animación
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Configurar cierre automático
        const autoClose = setTimeout(() => {
            closeToast(toast);
        }, 5000);
        
        // Manejar cierre manual
        const closeBtn = toast.querySelector('.contact-toast-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoClose);
            closeToast(toast);
        });
    }
    
    function closeToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
});

// Añadir CSS para animaciones
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
    </style>
`);
