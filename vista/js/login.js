
console.log("prueba de loghin");

document.getElementById('login').addEventListener('submit', async function (e) {
    e.preventDefault(); 
    const usuario = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:4000/usuario/login', {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({usuario, password})
        })
        const data = await response.json()
        if(response.ok){
            
            window.location.replace('/index')
        }else{
            alert(data.message);
        }
    } catch (error) {
        console.error(error)
        alert('hubo un problema al iniciar sesion')
    }
} )

