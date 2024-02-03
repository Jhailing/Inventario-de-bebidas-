//Inicio aplicación
let productos;
obtenerJson();
console.table(productos);
let carro = JSON.parse(localStorage.getItem('carro')) || [];
let tablaBody = document.getElementById('tablaBody');
let contenedorProds = document.getElementById('misprods');
let finalizarBtn = document.getElementById('finalizar');
let vaciarBtn = document.getElementById('vaciar');

//tratamiento si encontramos algo en un carrito abandonado
(carro.length != 0) && dibujarTabla();

//dibujo tabla si hay algo en el storage al comienzo
function dibujarTabla() {
    for(const prod of carro){
        document.getElementById('tablaBody').innerHTML += `
            <tr>
                <td>${prod.id}</td>
                <td>${prod.nombre}</td>
                <td>${prod.precio}</td>
                <td><button class= "btn btn-light" onclick="eliminar(event)">tacho basura</button></td>
            </tr>
        `; 
    }
    totalCarrito = carro.reduce((acc,prod) => acc + prod.precio,0);
    let infoTotal = document.getElementById("total");
    infoTotal.innerText="Total a pagar $: "+totalCarrito;
}

//función para eliminar elementos del carro
//Para eliminar prods del carro
function eliminar(e) {
    console.log(e);
    let fila = e.target.parentElement.parentElement;
    console.log(fila);
    let id = fila.children[0].innerText;
    console.log(id);
    let indice = carro.findIndex(prod => prod.id == id);
    console.log(indice);
    //remueve el prod del carro
    carro.splice(indice,1);
    console.table(carro);
    //remueve la fila de la tabla
    fila.remove();
    //recalcular el total
    let preciosAcumulados = carro.reduce((acc,prod) => acc + prod.precio,0);
    total.innerText="Total a pagar $: "+preciosAcumulados;
    //agregar el calculo en pesos

    //storage
    localStorage.setItem('carro',JSON,stringify(carro));  
}

// función que muestra las cards en la pantalla 
function renderizarProductos(listaProds) {
    //se vacia el carro para evitar duplicados
    contenedorProds.innerHTML = '';
    //cangando las cards en los productos solicitados
    for(const prod of listaProds){
        contededorProds.innerHTML += `
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
        //opcion 1
        boton.addEventListener('click',()=>{
            const prodACarro = productos.find((prod) => prod.id == boton.id);
            console.log(prodACarro);
            agregarACarro(prodACarro);
        })

        //opcion 2
        boton.onmouseover = () => {
            boton.classList.replace('btn-primary','btn.warning');
        }
        boton.onmouseout = () => {
            boton.classList.replace('btn-warning','btn-primary');
        }
    }
}

function agregarACarrito(prod) {
    carro.push(prod);
    console.table(carro);
    Swal.fire({
        title: 'Fantastico!',
        text: `Agregaste ${prod.nombre} al carrito!`,
        imageUrl: prod.foto,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: prod.nombre, 
    });
    tableBody.innerHTML += `
        <tr>
        <td>${prod.id}</td>
        <td>${prod.nombre}</td>
        <td>${prod.precio}</td>
        <td><button class= "btn btn-light" onclick="eliminar(event)">tacho basura</button></td>
    </tr>
    `;
    //calcular total
    let total = carro.reduce((acc,prod) => acc + prod.precio,0);
    console.log(total);
    document.getElementById('total').innerText = `Total a pagar $:${total}`;
    //trabajar con el storage
    localStorage.setItem('carro',JSON.stringify(carro)); 
}

//Filtros
let filtro= document.getElementById('filtro');
let min= document.getElementById('min');
let max= document.getElementById('max');

//filtrar por precio
function filtrarPorPrecio(precioMin, precioMax){
    const filtrados = productos.filter((prod)=> (prod.precio >= precioMin) && (prod.precio <= precioMax));
    sessionStorage.setItem('filtrados',JSON.stringify(filtrados));
    console.log(filtrados);
    return filtrados;
}

filtro.onclick = () => {
    console.log('click');
    console.log(min.value, max.value);
    if((min.value !== '') && (max.value !== '')&&(min.value < max.value)){
        let listaFiltrados = filtrarPorPrecio(min.value, max.value);
        console.log(listaFiltrados);
        renderizarProductos(listaFiltrados);
    }
}

//agregar btn que borre los filtros para que vuelva a la pantalla inicial.
finalizarBtn.onclick=()=>{
    carro=[];
    document.getElementById('tablabody').innerHTML ='';
    document.getElementById('total').innerText = 'Total a pagar $:';
    Swal.fire('Gracias por tu compra','Pronto la recibirás','success')
    //storage
    localStorage.removeItem('carro');
}

//vaciar carro
vaciarBtn.onclick=()=>{
    carro=[];
    document.getElementById('tablaBody').innerHTML = '';
    document.getElementById('total').innerText = 'Total a pagar $:';
    Swal.fire('Hemos vaciado el carro', 'Puedes volver a comenzar', 'success')
    localStorage.removeItem('carro');
}

//JSON
async function obtenerJson() {
    const URLJSON = '/productos.json';
    const respuesta = await fetch(URLJSON);
    const data = await respuesta.json();
    console.log(data);
    productos = data;
    renderizarProductos(productos);   
}