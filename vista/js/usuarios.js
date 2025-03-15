console.log("conectado a front");

//---------------------------Mostrar tabla-----------------------------
async function cargarUsuarios() {
    try {
        const response = await fetch('https://almacen-syatec-3ifx.onrender.com/usuario/mostrar');
        const data = await response.json();
        const tbody = document.getElementById('mostrar'); // Asegúrate de que el ID coincide con el tbody de la tabla
        tbody.innerHTML = ''; // Limpiar la tabla antes de volver a llenarla

        data.data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.id}</td>
                <td>${row.usuario}</td>
                <td>${row.rol}</td>
                <td>
                        <button class="edit-btn" onclick="editarUsuario(${row.id}, '${row.usuario}', '${row.rol}')">Editar</button>
                        <button class="delete-btn" onclick="eliminar(${row.id})">Eliminar</button>
                        <button onclick="location.reload()">Refrescar</button>

                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.log("Error al cargar la tabla de usuarios", error);
    }
}

//-------------------------------Agregar un nuevo usuario-----------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('formAgregar');

    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault(); // Evita el envío tradicional del formulario

            const usuario = document.getElementById('usuario').value.trim();
            const password = document.getElementById('password').value.trim();
            const rol = document.getElementById('rol').value.trim();

            if (!usuario || !password || !rol) {
                alert('Todos los campos son obligatorios.');
                return;
            }

            const nuevoUsuario = {
                usuario,
                password,
                rol
            };

            try {
                const response = await fetch('https://almacen-syatec-3ifx.onrender.com/usuario/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nuevoUsuario)
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Agregado correctamente.');
                    form.reset(); // Limpiar formulario

                    // Redirigir a la página principal y actualizar la tabla
                    window.location.href = "/usuarios" // Aquí se redirige a la página principal.
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

//---------------------------------------------Editar un usuario--------------------------------------------------
function editarUsuario(id, usuario, rol) {
    const user = {
        id,
        usuario,
        rol
    };

    // Guardar los datos en localStorage con la clave 'usuario_editar'
    localStorage.setItem('usuario_editar', JSON.stringify(user));

    // Redirigir al formulario de edición
    window.location.href = '/editarUsuario';
}

document.addEventListener("DOMContentLoaded", function () {
    // Obtener los datos de localStorage con la misma clave 'usuario_editar'
    const editarData = JSON.parse(localStorage.getItem('usuario_editar'));

    if (editarData) {
        // Prellenar el formulario con los datos obtenidos de localStorage
        document.getElementById('usuario').value = editarData.usuario;
        document.getElementById('rol').value = editarData.rol;
    }

    // Aquí agregamos el evento para enviar la actualización al backend
    document.getElementById('formEditar').addEventListener('submit', async function (event) {
        event.preventDefault();

        // Obtener los valores del formulario
        const usuario = document.getElementById('usuario').value.trim();
        const password = document.getElementById('password').value.trim();
        const rol = document.getElementById('rol').value.trim();

        // Validación de campos obligatorios
        if (!usuario || !password || !rol) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        // Crear el objeto de usuario actualizado
        const usuarioActualizado = {
            id: editarData.id, // El ID se mantiene para identificar el registro
            usuario,
            password,
            rol
        };

        try {
            const response = await fetch(`https://almacen-syatec-3ifx.onrender.com/usuario/actualizar/${editarData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuarioActualizado)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Usuario actualizado correctamente.');
                localStorage.removeItem('usuario_editar'); // Limpiar los datos del localStorage
                window.location.href = '/usuarios'; // Redirigir a la página de mostrar
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
        }
    });
});


//--------------------------------Eliminar un usuario-----------------------------------------
async function eliminar(id) {
    if (!confirm("¿Estás seguro de eliminar este registro?")) return;
    try {
        const response = await fetch(`https://almacen-syatec-3ifx.onrender.com/usuario/eliminar/${id}`, {
            method: 'DELETE'
        })
        if (response.ok) {
            alert("Registro eliminado correctamente");
            cargarUsuarios() // Recargar la tabla después de eliminar
        } else {
            alert("No se pudo eliminar, hubo algún problema. Inténtelo más tarde");
        }
    } catch (error) {
        console.error(error);
    }
}


// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", cargarUsuarios);
