document.getElementById('login').addEventListener('submit', async function (e) {
    e.preventDefault(); 
    const usuario = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:4000/usuario/login', {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({usuario, password}),
            credentials: 'include' // Enviar cookies
        });

        const data = await response.json();

        if (response.ok) {
            // Redirigir según el rol
            if (data.rol === 'administrador') {
                window.location.replace('/index');  // Página del administrador
            } else {
                window.location.replace('/usuarioIndex');  // Página del usuario normal
            }
        } else {
            alert(data.message);  // Mostrar mensaje de error si no se puede iniciar sesión
        }
    } catch (error) {
        console.error(error);
        alert('Hubo un problema al iniciar sesión');
    }
});
