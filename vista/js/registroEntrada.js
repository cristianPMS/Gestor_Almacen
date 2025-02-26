
console.log("hay comunicacion con el front de entrada");

//---------------------------Mostrar tabla-----------------------------
async function cargarDatos() {
    try {
        const response = await fetch('http://localhost:4000/ingresar/mostrar');
        const data = await response.json();
        const tbody = document.getElementById('mostrar'); // Asegúrate de que el ID coincide con el tbody de la tabla
        tbody.innerHTML = ''; // Limpiar la tabla antes de volver a llenarla

        data.data.forEach(row => {
            const tr = document.createElement('tr');

            // Convertir la fecha a un formato legible
            const fechaFormateada = new Date(row.fecha_ingreso).toLocaleString('es-MX', {
                timeZone: 'America/Mexico_City',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            tr.innerHTML = `
                <td>${row.id}</td>
                <td>${row.nombre_material}</td>  
                <td>${row.nombre}</td>
                <td>${row.cantidad_ingresada}</td>
                <td>${fechaFormateada}</td>
                <td>
                    <button onclick="editarRegistro(${row.id}, '${row.nombre_material}', '${row.nombre}', '${row.cantidad_ingresada}', '${row.fecha_ingreso}')">Editar</button>
                    <button onclick="eliminar(${row.id})">Eliminar</button>
                </td> `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.log("Error al cargar la tabla ", error);
    }
}


//----------------------------------------------------------------------------------------------------------------
//-----------------------------------Agregar un registro----------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", async function () {
    await cargarMateriales();
    await cargarTrabajadores();

    const form = document.getElementById("formRegistrarEntrada");
    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            const id_material = document.getElementById("material")?.value;
            const id_trabajador = document.getElementById("trabajador")?.value;
            const cantidad_ingresada = document.getElementById("cantidad")?.value;
            const fecha_ingreso = document.getElementById("hora")?.value;

            if (!id_material || !id_trabajador || !cantidad_ingresada || !fecha_ingreso) {
                alert("Todos los campos son obligatorios.");
                return;
            }

            const datosEntrada = { id_material, id_trabajador, cantidad_ingresada, fecha_ingreso };

            try {
                const response = await fetch("http://localhost:4000/ingresar/ingresar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(datosEntrada)
                });

                const data = await response.json();
                if (response.ok) {
                    alert("Registro de salida exitoso.");
                    form.reset();

                    // Redirigir a la tabla principal y actualizar los datos
                    window.location.href = "/entrada"; // Cambia esto por la ruta correcta de tu tabla
                } else {
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error("Error al registrar la salida:", error);
                alert("Hubo un error al registrar la salida.");
            }
        });
    }
});


async function cargarMateriales() {
    const selectMaterial = document.getElementById("material");
    if (!selectMaterial) {
        console.error("Error: No se encontró el elemento select de materiales.");
        return;
    }

    try {
        const response = await fetch("http://localhost:4000/principal/principal");
        const data = await response.json();
        selectMaterial.innerHTML = '<option value="">Seleccione un material</option>';

        data.data.forEach(material => {
            const option = document.createElement("option");
            option.value = material.id;  // Usar el ID del material
            option.textContent = material.nombre_material;  // Mostrar el nombre del material
            selectMaterial.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar materiales:", error);
    }
}

async function cargarTrabajadores() {
    const selectTrabajador = document.getElementById("trabajador");
    if (!selectTrabajador) {
        console.error("Error: No se encontró el elemento select de trabajadores.");
        return;
    }

    try {
        const response = await fetch("http://localhost:4000/trabajador/visualizar");
        const data = await response.json();
        selectTrabajador.innerHTML = '<option value="">Seleccione un trabajador</option>';

        data.data.forEach(trabajador => {
            const option = document.createElement("option");
            option.value = trabajador.id;  // Usar el ID del trabajador
            option.textContent = trabajador.nombre;  // Mostrar el nombre del trabajador
            selectTrabajador.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar trabajadores:", error);
    }
}

//--------------------------------------Editar salida----------------------------------------------
// Función para almacenar un registro en localStorage y redirigir a la edición
function editarRegistro(id, nombre_material, id_trabajador, cantidad_ingresada, fecha_ingreso) {
    const registroEntrada = {
        id,
        nombre_material,  // Aquí almacenas el nombre del material (solo para mostrar en el formulario)
        id_trabajador,   // Aquí almacenas el ID del trabajador
        cantidad_ingresada,
        fecha_ingreso
    };

    // Guardar los datos en localStorage con la clave 'registro_salida_editar'
    localStorage.setItem('registro_entrada_editar', JSON.stringify(registroEntrada));

    // Redirigir al formulario de edición
    window.location.href = '/editarEntrada';
}

document.addEventListener("DOMContentLoaded", async function () {
    const editarData = JSON.parse(localStorage.getItem('registro_entrada_editar'));

    if (editarData) {
        // Asignar valores a los campos del formulario
        document.getElementById('cantidad').value = editarData.cantidad_ingresada;
        document.getElementById('hora').value = editarData.fecha_ingreso.replace(" ", "T");

        // Esperar a que se carguen los materiales y trabajadores antes de asignar valores
        await cargarMateriales();
        await cargarTrabajadores();

        // Asignar los valores correctos a los campos del formulario
        document.getElementById('material').value = editarData.id_material;  // Usar el ID del material
        document.getElementById('trabajador').value = editarData.id_trabajador;  // Usar el ID del trabajador
    }

    // Evento para actualizar el registro
    document.getElementById('formEditarEntrada').addEventListener('submit', async function (event) {
        event.preventDefault();

        // Obtener los valores del formulario
        const id_material = document.getElementById('material').value.trim();  // Obtener el ID del material
        const id_trabajador = document.getElementById('trabajador').value.trim();  // Obtener el ID del trabajador
        const cantidad = document.getElementById('cantidad').value.trim();
        const hora = document.getElementById('hora').value.trim();

        console.log('ID del material:', id_material);  // Verificar el ID del material
        console.log('ID del trabajador:', id_trabajador);  // Verificar el ID del trabajador
        console.log('Cantidad ingresada:', cantidad);
        console.log('Fecha de ingreso:', hora);

        if (!id_material || !id_trabajador || !cantidad || !hora) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        // Crear el objeto con los datos actualizados
        const EntradaActualizada = {
            id: editarData.id,
            id_material: parseInt(id_material, 10),  // Enviar el ID del material
            id_trabajador: parseInt(id_trabajador, 10),  // Enviar el ID del trabajador
            cantidad_ingresada: parseInt(cantidad, 10),
            fecha_ingreso: hora
        };

        // Hacer la petición de actualización
        try {
            const response = await fetch(`http://localhost:4000/ingresar/actualizar/${editarData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(EntradaActualizada)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Registro de salida actualizado correctamente.');
                localStorage.removeItem('registro_entrada_editar');
                window.location.href = '/entrada';
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error al actualizar el registro de salida:', error);
        }
    });
});






//---------------------------------Eliminar un registro----------------------------------------------


async function eliminar(id) {
    if (!confirm("estas seguro de eliminar este registro?")) return;
    try {
        const response = await fetch(`http://localhost:4000/ingresar/eliminar/${id}`, {
            method: 'DELETE'
        })
        if (response.ok) {
            alert("registro eliminado correctamente");
            cargarDatos()
        } else {
            alert("No se pudo eliminar, intentelo mas tarde");
        }
    } catch (error) {
        console.error(error);
    }
}



// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", cargarDatos);

