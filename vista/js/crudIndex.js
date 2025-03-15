console.log("conectado a front")
//----------------------------Mostrar datos---------------------------------------------------------
async function cargarDatos() {
    try {
        const response = await fetch('https://almacen-syatec-3ifx.onrender.com/principal/principal');
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
                <td>
                    <button class="edit-btn" onclick="editar(${row.id}, '${row.nombre_material}', '${row.identificador}', '${row.cantidad}', '${row.categoria}')">Editar</button>
                    <button class="delete-btn" onclick="eliminar(${row.id})">Eliminar</button>
                </td>
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
//-------------------------------Agregar datos a la tabla-------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('formAgregar');

    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault(); // Evita el envío tradicional del formulario

            const nombre_material = document.getElementById('nombre_material').value.trim();
            const identificador = document.getElementById('identificador').value.trim();
            const cantidad = document.getElementById('cantidad').value.trim();
            const categoria = document.getElementById('categoria').value.trim();

            if (!nombre_material || !identificador || !cantidad || !categoria) {
                alert('Todos los campos son obligatorios.');
                return;
            }

            const nuevoMaterial = {
                nombre_material,
                identificador,
                cantidad: parseInt(cantidad, 10), // Convertir a número
                categoria
            };

            try {
                const response = await fetch('https://almacen-syatec-3ifx.onrender.com/principal/agregar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nuevoMaterial)
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Agregado correctamente.');
                    form.reset(); // Limpiar formulario
                    
                    // Redirigir a la página principal y actualizar la tabla
                    window.location.href = '/index'; // Aquí se redirige a la página principal.
                } else {
                    alert(`Error: ${result.message}`);
                }
            } catch (error) {
                console.error('Error, ya existe un registro con ese nombre', error);
            }
        });
    } else {
        console.error(".");
    }
});

//----------------------------------------Editar---------------------------------------------

function editar(id, nombre_material, identificador, cantidad, categoria) {
    const material = {
        id,
        nombre_material,
        identificador,
        cantidad,
        categoria
    };

    // Guardar los datos en localStorage con la clave 'material_editar'
    localStorage.setItem('material_editar', JSON.stringify(material));

    // Redirigir al formulario de edición
    window.location.href = '/modificarIndex';
}

//Editar 

document.addEventListener("DOMContentLoaded", function() {
    // Obtener los datos de localStorage con la misma clave 'material_editar'
    const editarData = JSON.parse(localStorage.getItem('material_editar'));

    if (editarData) {
        // Prellenar el formulario con los datos obtenidos de localStorage
        document.getElementById('nombre_material').value = editarData.nombre_material;
        document.getElementById('identificador').value = editarData.identificador;
        document.getElementById('cantidad').value = editarData.cantidad;
        document.getElementById('categoria').value = editarData.categoria;
    }

    // Aquí agregamos el evento para enviar la actualización al backend
    document.getElementById('formEditar').addEventListener('submit', async function(event) {
        event.preventDefault();

        // Obtener los valores del formulario
        const nombre_material = document.getElementById('nombre_material').value.trim();
        const identificador = document.getElementById('identificador').value.trim();
        const cantidad = document.getElementById('cantidad').value.trim();
        const categoria = document.getElementById('categoria').value.trim();

        if (!nombre_material || !identificador || !cantidad || !categoria) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        const materialActualizado = {
            id: editarData.id, // El ID se mantiene para identificar el registro
            nombre_material,
            identificador,
            cantidad: parseInt(cantidad, 10), // Convertir a número
            categoria
        };

        try {
            const response = await fetch(`https://almacen-syatec-3ifx.onrender.com/principal/actualizar/${editarData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(materialActualizado)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Registro actualizado correctamente.');
                localStorage.removeItem('material_editar'); // Limpiar los datos del localStorage
                window.location.href = '/index'; // Redirigir a la página de mostrar
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error al actualizar el material:', error);
        }
    });
});


//-----------------------------------------------Eliminar----------------------------------------------

async function eliminar(id) {
    if (!confirm("estas seguro de eliminar este registro?")) return;
    try {
        const response = await fetch(`https://almacen-syatec-3ifx.onrender.com/principal/eliminar/${id}`, {
            method: 'DELETE'
        })
        if (response.ok) {
            alert("registro eliminado correctamente");
            cargarDatos()
        } else {
            alert("No se pudo eliminar, el registro esta registrado en otra tabla");
        }
    } catch (error) {
        console.error(error);
    }
}







document.addEventListener('DOMContentLoaded', cargarDatos);