// ==========================================
// PRE-ENTREGA 8: PERSISTENCIA, STORAGE Y OPERADORES
// ==========================================

// 1) Array inicial de productos usando localStorage o valores por defecto
let productos = JSON.parse(localStorage.getItem("productos")) || [
    { id: 1, nombre: "Teclado mecánico", precio: 45000 },
    { id: 2, nombre: "Mouse inalámbrico", precio: 22000 },
    { id: 3, nombre: "Monitor 24''", precio: 180000 }
];

// 2) Selección de elementos del DOM
const contenedorItems = document.getElementById("contenedor-items");
const formProducto = document.getElementById("form-producto");
const nombreInput = document.getElementById("nombre-input");
const precioInput = document.getElementById("precio-input");
const buscadorInput = document.getElementById("buscador-input");
const feedbackMensaje = document.getElementById("feedback-mensaje");

// 3) Función para guardar en localStorage con JSON.stringify
const guardarEnStorage = (arrProductos) => {
    localStorage.setItem("productos", JSON.stringify(arrProductos));
};

// 4) Función de feedback visual
function mostrarFeedback(mensaje, tipo = "exito") {
    feedbackMensaje.textContent = mensaje;
    feedbackMensaje.className = tipo; 
    
    setTimeout(() => {
        feedbackMensaje.className = "oculto";
    }, 3000);
}

// 5) Renderizado dinámico (Usando Destructuring y Operador Ternario)
function renderizarProductos(arrayA_Mostrar) {
    contenedorItems.innerHTML = "";

    arrayA_Mostrar.length === 0 
        ? contenedorItems.innerHTML = `<p style="text-align:center; color: #7f8c8d;">No hay productos para mostrar.</p>`
        : arrayA_Mostrar.forEach((producto) => {
            // Destructuring aplicado
            const { id, nombre, precio } = producto;

            const tarjeta = document.createElement("div");
            tarjeta.className = "producto-card";

            tarjeta.innerHTML = `
                <div class="producto-info">
                    <h3>${nombre}</h3>
                    <p>$${precio.toLocaleString('es-AR')}</p>
                </div>
                <button class="btn-eliminar" data-id="${id}">Eliminar</button>
            `;

            contenedorItems.appendChild(tarjeta);
        });

    activarBotonesEliminar();
}

// 6) Eliminar elemento y actualizar storage
function activarBotonesEliminar() {
    const botonesEliminar = document.querySelectorAll(".btn-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", (e) => {
            const idObtenido = parseInt(e.target.getAttribute("data-id"));
            
            productos = productos.filter(prod => prod.id !== idObtenido);

            guardarEnStorage(productos);
            renderizarProductos(productos);
            mostrarFeedback("🗑️ Producto eliminado y actualizado en Storage.", "alerta");
        });
    });
}

// 7) Agregar producto desde el formulario
formProducto.addEventListener("submit", (e) => {
    e.preventDefault(); 

    const nombreTexto = nombreInput.value.trim();
    const precioValor = parseFloat(precioInput.value);

    if (nombreTexto === "" || isNaN(precioValor) || precioValor <= 0) {
        mostrarFeedback("⚠️ Por favor, completa los campos correctamente.", "alerta");
        return;
    }

    const nuevoProducto = {
        id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1,
        nombre: nombreTexto,
        precio: precioValor
    };

    productos.push(nuevoProducto);
    guardarEnStorage(productos);
    renderizarProductos(productos);
    mostrarFeedback(`✅ ¡"${nuevoProducto.nombre}" guardado con éxito!`, "exito");

    formProducto.reset();
});

// 8) Búsqueda en tiempo real con evento de teclado
buscadorInput.addEventListener("keyup", (e) => {
    const textoBusqueda = e.target.value.toLowerCase().trim();

    const resultadosFiltrados = productos.filter(prod => 
        prod.nombre.toLowerCase().includes(textoBusqueda)
    );

    renderizarProductos(resultadosFiltrados);
});

// Carga inicial al abrir la página
renderizarProductos(productos);