// console.table(productos);

// LLamando del html los elementos que necesito 
let contededorProds = document.getElementById('misProds');
let containerProds = document.getElementById('misprods');
let tablaBody = document.getElementById('tablaBody');
let total = document.getElementById('total');
// Guardando en el local storage para que no se borre 
const carro = JSON.parse(localStorage.getItem('carro')) || [];

// DOM
// función que muestra las cards en la pantalla 
function renderizarProductos(listaProds) {
    for(const prod of listaProds){
        contededorProds.innerHTML += `
        <div class="card" style="width: 18rem; padding: 5px; margin: 5px;">
            <img src=${prod.foto} class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${prod.nombre}</h5>
                <p class="card-text">$ ${prod.precio}</p>
                <button id=${prod.id} class="btn btn-primary compra">Comprar</button>
            </div>
        </div>
        `;
    }

    // Evento que registra que el producto fue seleccionado
    let botones = document.getElementsByClassName('compra');
    for(const boton of botones){
        boton.addEventListener('click',()=>{
            const prodCarro = productos.find((prod) => prod.id == boton.id);

            // cargar productos al carro 
            agregarACarro(prodCarro);
        })
    }
}
renderizarProductos(productos);

// Función que muestra en pantalla a traves de la tabla, los productos seleccionados 
function agregarACarro(producto) {
    carro.push(producto);
    // console.table(carro);
    tablaBody.innerHTML += `
        <tr>
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
        </tr>
    `;
    // calculando el total 
    let sumaTotal = carro.reduce((acc,prod)=> acc + prod.precio,0);
    console.log(sumaTotal);
    total.innerHTML = `Total a pagar $:${sumaTotal}`; 
    
    // guardar en el local storage 
    localStorage.setItem('carro', JSON.stringify(carro));
}