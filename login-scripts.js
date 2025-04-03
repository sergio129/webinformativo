document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');
    
    // Verificar si ya hay una sesión activa
    checkSession();
    
    // Manejar envío del formulario de login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener los valores de los campos
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const rememberMe = document.getElementById('remember-me').checked;
            
            // Credenciales válidas (hardcoded para este ejemplo)
            const validUsername = "admin";
            const validPassword = "qualitest2025";
            
            // Simular verificación de credenciales
            if (username === validUsername && password === validPassword) {
                // Credenciales correctas
                loginMessage.textContent = "Iniciando sesión...";
                loginMessage.className = "login-message success";
                
                // Crear objeto con datos de sesión
                const sessionData = {
                    username: username,
                    isLoggedIn: true,
                    loginTime: new Date().toISOString(),
                    // No guardar la contraseña por seguridad
                };
                
                // Guardar sesión en localStorage o sessionStorage según "recordar sesión"
                if (rememberMe) {
                    localStorage.setItem('qualitest_session', JSON.stringify(sessionData));
                } else {
                    sessionStorage.setItem('qualitest_session', JSON.stringify(sessionData));
                }
                
                // Redirigir al panel de administración después de 1 segundo
                setTimeout(function() {
                    window.location.href = "admin.html";
                }, 1000);
            } else {
                // Credenciales incorrectas
                loginMessage.textContent = "Usuario o contraseña incorrectos";
                loginMessage.className = "login-message error";
                
                // Añadir animación de shake al formulario
                loginForm.classList.add('shake');
                setTimeout(() => {
                    loginForm.classList.remove('shake');
                }, 600);
                
                // Resaltar campos con error
                document.getElementById('username').classList.add('is-invalid');
                document.getElementById('password').classList.add('is-invalid');
                
                // Limpiar el campo de contraseña
                document.getElementById('password').value = '';
            }
        });
        
        // Quitar resaltado de error al escribir
        const formInputs = loginForm.querySelectorAll('input');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('is-invalid');
                loginMessage.textContent = '';
                loginMessage.className = 'login-message';
            });
        });
    }
    
    // Función para verificar si hay una sesión activa
    function checkSession() {
        const sessionData = 
            JSON.parse(localStorage.getItem('qualitest_session')) || 
            JSON.parse(sessionStorage.getItem('qualitest_session'));
        
        if (sessionData && sessionData.isLoggedIn) {
            // Si hay una sesión activa, redirigir al panel de administración
            window.location.href = "admin.html";
        }
    }
});
