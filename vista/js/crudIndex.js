console.log("conectado a front")

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
            tbody.appendChild(tr)
        });
    } catch (error) {
        console.log("error al cargar la tabla", error);
    }
}



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
            alert("error al eliminar el registro");
        }
    } catch (error) {
        console.error(error);
    }
}


// async function editar(id, nombre_material, identificador, cantidad, categoria) {
//     const newNombre = prompt('nuevo nombre: ', nombre_material)
//     const newIdentificador = prompt('nuevo nombre: ', identificador)
//     const newCantidad = prompt('nuevo nombre: ', cantidad)
//     const newCategoria = prompt('nuevo nombre: ', categoria)

//     if (!newNombre || !newIdentificador || !newCantidad || !newCategoria) return alert("todos los campos son obligatorios")

//     try {
//         const response = await fetch(`http://localhost:4000/principal/actualizar/${id}`,{
//         method:'PUT',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify({newNombre,newIdentificador,newCantidad,newCategoria})
//         })
//         if(response.ok){
//             alert('registro actualizado');
//             cargarDatos()
//         }else{
//             alert("error al actualizar registro");
//         }

//     } catch (error) {
//       console.error(error);
//     }
// }

document.addEventListener('DOMContentLoaded', cargarDatos);