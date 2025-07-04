const apiURL = 'http://localhost:3000/api/productos';

const form = document.getElementById('form-producto');
const tablaBody = document.querySelector('#tabla-productos tbody');

const inputId = document.getElementById('producto-id');
const inputNombre = document.getElementById('nombre');
const inputDescripcion = document.getElementById('descripcion');
const inputPrecio = document.getElementById('precio');
const btnCancelar = document.getElementById('cancelar');

let editando = false;

// Función para cargar productos y mostrarlos en la tabla
async function cargarProductos() {
  try {
    const res = await fetch(apiURL);
    const productos = await res.json();

    console.log('Productos recibidos:', productos);

    tablaBody.innerHTML = '';

    productos.forEach(p => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${p.id}</td>
        <td>${p.nombre}</td>
        <td>${p.descripcion || ''}</td>
        <td>${parseFloat(p.precio).toFixed(2)}</td>
        <td>
          <button onclick="editarProducto(${p.id})">Editar</button>
          <button onclick="eliminarProducto(${p.id})">Eliminar</button>
        </td>
      `;
      tablaBody.appendChild(fila);
    });
  } catch (error) {
    console.error('Error cargando productos:', error);
  }
}

// Función para enviar formulario
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const producto = {
    nombre: inputNombre.value,
    descripcion: inputDescripcion.value,
    precio: parseFloat(inputPrecio.value)
  };

  try {
    if (!editando) {
      // Crear producto
      await fetch(apiURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
      });
    } else {
      // Editar producto
      const id = inputId.value;
      await fetch(`${apiURL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
      });
      editando = false;
      btnCancelar.style.display = 'none';
    }

    form.reset();
    cargarProductos();
  } catch (error) {
    console.error('Error guardando producto:', error);
  }
});

async function editarProducto(id) {
  try {
    const res = await fetch(`${apiURL}/${id}`);
    const producto = await res.json();

    inputId.value = producto.id;
    inputNombre.value = producto.nombre;
    inputDescripcion.value = producto.descripcion;
    inputPrecio.value = producto.precio;

    editando = true;
    btnCancelar.style.display = 'inline';
  } catch (error) {
    console.error('Error cargando producto para editar:', error);
  }
}

// Función para eliminar producto
async function eliminarProducto(id) {
  if (confirm('¿Seguro quieres eliminar este producto?')) {
    try {
      await fetch(`${apiURL}/${id}`, { method: 'DELETE' });
      cargarProductos();
    } catch (error) {
      console.error('Error eliminando producto:', error);
    }
  }
}

// Cancelar edición
btnCancelar.addEventListener('click', () => {
  form.reset();
  editando = false;
  btnCancelar.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
});
