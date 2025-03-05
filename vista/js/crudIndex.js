console.log("conectado a front")
//----------------------------Mostrar datos---------------------------------------------------------
async function cargarDatos() {
    try {
        const response = await fetch('http://localhost:4000/principal/principal');
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
                    <button onclick="editar(${row.id}, '${row.nombre_material}','${row.identificador}','${row.cantidad}','${row.categoria}')" >Editar</button>
                    <button onclick="eliminar(${row.id})" >Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.log("Error al cargar la tabla", error);
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
                const response = await fetch('http://localhost:4000/principal/agregar', {
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
            const response = await fetch(`http://localhost:4000/principal/actualizar/${editarData.id}`, {
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
        const response = await fetch(`http://localhost:4000/principal/eliminar/${id}`, {
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