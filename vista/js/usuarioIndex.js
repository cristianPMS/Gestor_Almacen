//----------------------------Mostrar datos---------------------------------------------------------
async function cargarDatos() {
    try {
        const response = await fetch('http://localhost:4000/principal/usuario');
        const data = await response.json();
        const tbody = document.getElementById('mostrar');
        tbody.innerHTML = '';
        data.data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.id}</td>
                <td>${row.nombre_material}</td>
                <td>${row.identificador}</td>
                <td>${row.cantidad}</td>
                <td>${row.categoria}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.log("Error al cargar la tabla", error);
    }
}

// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", cargarDatos);

