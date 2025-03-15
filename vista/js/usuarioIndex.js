//----------------------------Mostrar datos---------------------------------------------------------
async function cargarDatos() {
    try {
        const response = await fetch('https://almacen-syatec-3ifx.onrender.com/principal/usuario');
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

        // Agregar funcionalidad de ordenamiento después de cargar los datos
        agregarOrdenamiento();
    } catch (error) {
        console.log("Error al cargar la tabla", error);
    }
}
//---------------------------Funcionalidad de ordenamiento-----------------------------
function agregarOrdenamiento() {
    const table = document.querySelector("table");
    const thElements = table.querySelectorAll("thead th");
    const tbody = table.querySelector("tbody");

    thElements.forEach((th, index) => {
        if (index < 5) { // Solo agregar ordenamiento a las primeras 5 columnas (ID, Nombre, Referencia, Cantidad, Categoría)
            th.addEventListener("click", () => {
                sortTable(index);
            });
        }
    });

    function sortTable(columnIndex) {
        const rows = Array.from(tbody.querySelectorAll("tr"));
        const isAscending = thElements[columnIndex].classList.toggle("asc");

        rows.sort((a, b) => {
            const aValue = a.cells[columnIndex].textContent.trim();
            const bValue = b.cells[columnIndex].textContent.trim();

            if (columnIndex === 0 || columnIndex === 3) { // Columnas de ID y Cantidad (números)
                return isAscending ? aValue - bValue : bValue - aValue;
            } else { // Columnas de Nombre, Referencia y Categoría (texto)
                return isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
        });

        // Limpiar y reinsertar filas ordenadas
        tbody.innerHTML = "";
        rows.forEach(row => tbody.appendChild(row));

        // Actualizar flechas de ordenamiento
        thElements.forEach(th => th.classList.remove("asc", "desc"));
        thElements[columnIndex].classList.add(isAscending ? "asc" : "desc");
    }
}

// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", cargarDatos);

