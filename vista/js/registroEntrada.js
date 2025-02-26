
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

            const datosSalida = { id_material, id_trabajador, cantidad_ingresada, fecha_ingreso };

            try {
                const response = await fetch("http://localhost:4000/ingresar/ingresar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(datosSalida)
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

