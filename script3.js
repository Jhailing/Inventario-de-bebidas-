//Inicio aplicación
let productos;
obtenerJson();
console.table(productos);
let carro = JSON.parse(localStorage.getItem('carro')) || [];
let tablaBody = document.getElementById('tablaBody');
let contenedorProds = document.getElementById('misProds');
let finalizarBtn = document.getElementById('finalizar');
let vaciarBtn = document.getElementById('vaciar');

//tratamiento si encontramos algo en un carrito abandonado
(carro.length != 0) && dibujarTabla();

//dibujo tabla si hay algo en el storage al comienzo
function dibujarTabla() {
    for(const prod of carro){
        tablaBody.innerHTML += `
            <tr>
                <td>${prod.id}</td>
                <td>${prod.nombre}</td>
                <td>${prod.precio}</td>
                <td><button class= "btn btn-light" onclick="eliminar(event)">Eliminar</button></td>
            </tr>
        `; 
    }
    totalCarrito = carro.reduce((acc,prod) => acc + prod.precio,0);
    let infoTotal = document.getElementById("total");
    infoTotal.innerText="Total a pagar $: "+totalCarrito;
}


//Para eliminar prods del carro
function eliminar(e) {
    let fila = e.target.parentElement.parentElement;
    let id = fila.children[0].innerText;
    let indice = carro.findIndex(prod => prod.id == id);
    //remueve el prod del carro
    carro.splice(indice,1);
    //remueve la fila de la tabla
    fila.remove();
    //recalcular el total
    let preciosAcumulados = carro.reduce((acc,prod) => acc + prod.precio,0);
    total.innerText="Total a pagar $: "+preciosAcumulados;
    //storage
    localStorage.setItem('carro',JSON.stringify(carro));  
}

// Función que muestra las cards en la pantalla 
function renderizarProductos(listaProds) {
    //se vacia el carro para evitar duplicados
    contenedorProds.innerHTML = '';
    //cargando las cards en los productos solicitados
    for(const prod of listaProds){
        contenedorProds.innerHTML += `
        <div class="card col-sm-2" style="width: 18rem; padding: 5px; margin: 5px;">
            <img src=${prod.foto} class="card-img-top" alt="imagen card">
            <div class="card-body">
                <h5 class="card-title">${prod.nombre}</h5>
                <p class="card-text">$ ${prod.precio}</p>
                <button id=${prod.id} class="btn btn-primary compra">Comprar</button>
            </div>
        </div>
        `;
    }
    //eventos
    let botones = document.getElementsByClassName('compra');
    for(const boton of botones){
        //opcion click
        boton.addEventListener('click',()=>{
            const prodACarro = productos.find((prod) => prod.id == boton.id);
            agregarACarrito(prodACarro);
        })

        //opcion hover
        boton.onmouseover = () => {
            boton.classList.replace('btn-primary','btn-warning');
        }
        boton.onmouseout = () => {
            boton.classList.replace('btn-warning','btn-primary');
        }
    }
}
// Función Modal
function agregarACarrito(prod) {
    carro.push(prod);
    Swal.fire({
        title: 'Fantastico!',
        text: `Agregaste ${prod.nombre} al carrito!`,
        imageUrl: prod.foto,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: prod.nombre, 
    });
    tablaBody.innerHTML += `
        <tr>
        <td>${prod.id}</td>
        <td>${prod.nombre}</td>
        <td>${prod.precio}</td>
        <td><button class= "btn btn-light" onclick="eliminar(event)">Eliminar</button></td>
    </tr>
    `;
    //calcular total
    let total = carro.reduce((acc,prod) => acc + prod.precio,0);
    document.getElementById('total').innerText = `Total a pagar $:${total}`;
    //trabajar con el storage
    localStorage.setItem('carro',JSON.stringify(carro)); 
}

//Filtros
let filtro= document.getElementById('filtro');
let min= document.getElementById('min');
let max= document.getElementById('max');
let btnBorrarFiltros = document.getElementById('quitarFiltro');

//filtrar por precio
function filtrarPorPrecio(productos, minPrecio, maxPrecio) {
    const min = parseFloat(minPrecio);
    const max = parseFloat(maxPrecio);

    if (isNaN(min) || isNaN(max) || min >= max) {
        console.error('Código inválido');
        return [];
    }

    return productos.filter((prod) => prod.precio >= min && prod.precio <= max);
}

// Evento para filtrar con el click
filtro.onclick = () => {
    const minPrice = min.value;
    const maxPrice = max.value;
    const filteredProducts = filtrarPorPrecio(productos, minPrice, maxPrice);

    // Filtra los productos que necesita y los guarda en el localStorage
    renderizarProductos(filteredProducts);
    localStorage.setItem('filtrados', JSON.stringify(filteredProducts));
};

// Remover los filtros y vuelve a la pantalla principal
    btnBorrarFiltros.onclick = () => {
    renderizarProductos(productos);
    localStorage.removeItem('filtrados');
};

//Finaliza compra, modal y vuelve a la pantalla inicial.
finalizarBtn.onclick=()=>{
    carro=[];
    tablaBody.innerHTML ='';
    document.getElementById("total").innerText = 'Total a pagar $:';
    Swal.fire('Gracias por tu compra','Pronto la recibirás','success')
    //storage
    localStorage.removeItem('carro');
}

//vaciar carro
vaciarBtn.onclick=()=>{
    carro=[];
    tablaBody.innerHTML = '';
    document.getElementById('total').innerText = 'Total a pagar $:';
    Swal.fire('Hemos vaciado el carro', 'Puedes volver a comenzar', 'success')
    localStorage.removeItem('carro');
}

//JSON
async function obtenerJson() {
    const URLJSON = '/productos.json';
    const respuesta = await fetch(URLJSON);
    const data = await respuesta.json();
    productos = data;
    renderizarProductos(productos);   
}