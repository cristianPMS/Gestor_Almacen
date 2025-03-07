console.log("conectado a front de trabajadores");


//----------------------------Mostrar datos---------------------------------------------------------
async function cargarDatos() {
    try {
        const response = await fetch('http://localhost:4000/trabajador/visualizar');
        const data = await response.json();
        const tbody = document.getElementById('mostrar');
        tbody.innerHTML = '';
        data.data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.id}</td>
                <td>${row.nombre}</td>
                <td>${row.area}</td>
                <td>
                    <button class="edit-btn" onclick="editar(${row.id}, '${row.nombre}','${row.area}')" >Editar</button>
                    <button class="delete-btn" onclick="eliminar(${row.id})" >Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.log("Error al cargar la tabla", error);
    }
}

//-------------------------------Dar de alta un nuevo trabajador-----------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('formAgregar');

    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault(); // Evita el envío tradicional del formulario

            const nombre = document.getElementById('nombre').value.trim();
            const area = document.getElementById('area').value.trim();

            if (!nombre || !area) {
                alert('Todos los campos son obligatorios.');
                return;
            }

            const nuevoTrabajador = {
                nombre,
                area
            };

            try {
                const response = await fetch('http://localhost:4000/trabajador/insertar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nuevoTrabajador)
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Agregado correctamente.');
                    form.reset(); // Limpiar formulario
                    
                    // Redirigir a la página principal y actualizar la tabla
                    window.location.href = '/trabajadores'; // Aquí se redirige a la página principal.
                } else {
                    alert(`Error: ${result.message}`);
                }
            } catch (error) {
                console.error('Error, ya existe un usuario con ese nombre', error);
            }
        });
    } else {
        console.error(".");
    }
});


//----------------------------------------Editar---------------------------------------------

function editar(id, nombre,area) {
    const trabajador = {
        id,
        nombre,
        area
    };

    // Guardar los datos en localStorage con la clave 'material_editar'
    localStorage.setItem('trabajador_editar', JSON.stringify(trabajador));

    // Redirigir al formulario de edición
    window.location.href = '/editarTrabajador';
}

//Editar 

document.addEventListener("DOMContentLoaded", function() {
    // Obtener los datos de localStorage con la misma clave 'material_editar'
    const editarData = JSON.parse(localStorage.getItem('trabajador_editar'));

    if (editarData) {
        // Prellenar el formulario con los datos obtenidos de localStorage
        document.getElementById('nombre').value = editarData.nombre;
        document.getElementById('area').value = editarData.area;
   
    }

    // Aquí agregamos el evento para enviar la actualización al backend
    document.getElementById('formEditar').addEventListener('submit', async function(event) {
        event.preventDefault();

        // Obtener los valores del formulario
        const nombre = document.getElementById('nombre').value.trim();
        const area = document.getElementById('area').value.trim();

        if (!nombre || !area) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        const trabajadorActualizado = {
            id: editarData.id, // El ID se mantiene para identificar el registro
            nombre,
            area
        };

        try {
            const response = await fetch(`http://localhost:4000/trabajador/actualizar/${editarData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(trabajadorActualizado)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Trabajador actualizado correctamente.');
                localStorage.removeItem('trabajador_editar'); // Limpiar los datos del localStorage
                window.location.href = '/trabajadores'; // Redirigir a la página de mostrar
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error al actualizar al trabajador:', error);
        }
    });
});


//--------------------------------Eliminar un trabajador----------------------------------------
async function eliminar(id) {
    if (!confirm("¿Estás seguro de eliminar a este trabajador?")) return;
    try {
        const response = await fetch(`http://localhost:4000/trabajador/eliminar/${id}`, {
            method: 'DELETE'
        })
        if (response.ok) {
            alert("Trabajador  eliminado correctamente");
            cargarDatos() // Recargar la tabla después de eliminar
        } else {
            alert("No se pudo eliminar, el trabajador se encuentra registrado en otra tabla");
        }
    } catch (error) {
        console.error(error);
    }
}




// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", cargarDatos);