// Esto siempre se tiene que hacer
let btnLog = document.getElementById('logIN/OUT');
btnLog.innerHTML = `<i class="bi bi-person-circle"></i>`;
btnLog.addEventListener('click',function(){
    window.location.href = '/login';
});



async function eliminarPedido(){

    console.log('funcion ejecutandose');

    let r = await fetch("http://localhost:3000/eliminarTodoPedido",{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        }
    });

    if(!r.ok){
        console.log('hubo un error con la comunicacion back-front');
    }


    let rJson = await r.json();


    if(rJson.eliminacion){

       console.log(rJson.eliminacion);

       if(rJson.eliminacion.retorno==1){
            window.location.href = '/menu';
       }

    }
}



async function pedirPedido(){


    // Primero pedir todos los pedidos
    const respuesta = await fetch("http://localhost:3000/pedirPedido",{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        }
    });

    if(!respuesta.ok){
        console.log('Hubo un error con la comunicacion front back');
    }

    let respuestaJSON = await respuesta.json();


    

    if(respuestaJSON.logueado != undefined){

        
        let logueado = respuestaJSON.logueado;

        if(logueado != false){

            
            btnLog = document.getElementById('logIN/OUT');
            btnLog.innerHTML = `<i class="bi bi-door-open-fill"></i>`;
            btnLog.addEventListener('click',function(){
                document.cookie = "megumin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            
                btnLog.innerHTML = `<i class="bi bi-person-circle"></i>`;
                btnLog.addEventListener('click',function(){
                    window.location.href = '/login';
                });
            });


            if(respuestaJSON.comidas.length==0 && respuestaJSON.bebidas.length==0){

                console.log('Si estas logueado pero no tienes productos');
                let c = document.getElementsByClassName("mensajeNull")[0];
                let i = document.getElementsByClassName("imagenNull")[0];

                c.style.display = "flex";
                i.style.display = "inline-block";
            }
            else{

                var comidas = respuestaJSON.comidas;
                console.log(comidas);

                var bebidas = respuestaJSON.bebidas;
                console.log(bebidas);

                let total=0;

                let contenedorPadre = document.getElementById('contenedor_carrito');

                contenedorPadre.innerHTML = `
                <div class="productos">
                        
                </div>
                <div class="procederPago">
                    <div class="izquierda">
                        <button class="seguir"><i class="bi bi-arrow-left-circle-fill"></i>Seguir Comprando</button>
                    </div>
                    <div class="derecha">
                        <span class="total"></span>
                        <button class="pagar">Proceder el pago</button>
                    </div>
                </div>
                `;

                let seguirComprando = document.getElementsByClassName('seguir')[0];

                seguirComprando.onclick = function(){
                    window.location.href = '/menu';
                }

                let contenedorProductos = document.getElementsByClassName('productos')[0];


                // hace falta anadir los productos que se compraron
                for(let indice in comidas){


                    // Antes que nada, sumemos el valor total
                    total = total + Object.values(comidas[indice])[4];


                    let divProducto = document.createElement('div');
                    divProducto.setAttribute('class','producto');
                    divProducto.setAttribute('id',Object.values(comidas[indice])[0]);


                    // div nombre comida
                    let divNombre = document.createElement('div');
                    divNombre.setAttribute('class','nombre_producto');
                    let spanNombre = document.createElement('span');
                    spanNombre.textContent = Object.values(comidas[indice])[0];
                    divNombre.append(spanNombre);

                    // div precio comida
                    let divPrecio = document.createElement('div');
                    divPrecio.setAttribute('class','precio_producto');
                    let spanPrecio = document.createElement('span');
                    spanPrecio.textContent = Object.values(comidas[indice])[1];
                    divPrecio.append(spanPrecio);

                    // div cantidad de la comida en cuestion
                    let divCantidad = document.createElement('div');
                    divCantidad.setAttribute('class','cantidad_producto');
                    let spanCantidad = document.createElement('span');
                    spanCantidad.textContent= Object.values(comidas[indice])[3];
                    divCantidad.append(spanCantidad);

                    //div subtotal de la comida
                    let divSubtotal = document.createElement('div');
                    divSubtotal.setAttribute('class','subtotal_producto');
                    let spanSubtotal = document.createElement('span');
                    spanSubtotal.textContent = Object.values(comidas[indice])[4];
                    divSubtotal.append(spanSubtotal);

                    // Boton de eliminar
                    let divEliminar = document.createElement('div');
                    divEliminar.setAttribute('class','eliminar_producto');
                    let boton = document.createElement('button');
                    boton.onclick = async function(){

                        let resDelete = await fetch("http://localhost:3000/eliminarPedidoProducto",{
                            method:'POST',
                            headers:{
                                'Content-Type':'application/json'
                            },
                            body:JSON.stringify({
                                comida:Object.values(comidas[indice])[0],
                                user:'karimtec2003@gmail.com'
                            })
                        });

                        if(!resDelete.ok){
                            console.log('Hubo un problema en la comunicacion back-front a la hora de eliminar el pedidoComida');
                        }

                        let resDeleteJson = await resDelete.json();

                        // Actualizar el total
                        if(resDeleteJson.total !== undefined){
                            console.log(resDeleteJson.total);
                            let sTo = document.getElementsByClassName('total')[0];
                            sTo.textContent = 'Total:'+resDeleteJson.total;

                            // Debemos de eliminar el divProducto perteneciente
                            let dPro = document.getElementById(Object.values(comidas[indice])[0]);
                            dPro.remove();


                            // Tambien vamos a llamar la funcion eliminar, tranquilo, si no esta vacio no eliminar el pedido
                            eliminarPedido('karimtec2003@gmail.com'); // <-- pasarle como parametro al usuario
                        }

                    }
                    boton.innerHTML = '<i class="bi bi-trash3-fill"></i>';
                    divEliminar.append(boton);


                    divProducto.append(divNombre);
                    divProducto.append(divPrecio);
                    divProducto.append(divCantidad);
                    divProducto.append(divSubtotal);
                    divProducto.append(divEliminar);

                    // toca agregar divProducto al contenedorProductos
                    contenedorProductos.append(divProducto);

                }

                for(let indice in bebidas){

                    // antes que nada, sumar el total de las bebidas
                    total = total+ Object.values(bebidas[indice])[5];


                    let divProducto = document.createElement('div');
                    divProducto.setAttribute('class','producto');
                    divProducto.setAttribute('id',Object.values(bebidas[indice])[0]);


                    // div nombre bebida
                    let divNombre = document.createElement('div');
                    divNombre.setAttribute('class','nombre_producto');
                    let spanNombre = document.createElement('span');
                    spanNombre.textContent = Object.values(bebidas[indice])[0]+"_"+Object.values(bebidas[indice])[3];
                    divNombre.append(spanNombre);

                    // div precio comida
                    let divPrecio = document.createElement('div');
                    divPrecio.setAttribute('class','precio_producto');
                    let spanPrecio = document.createElement('span');
                    spanPrecio.textContent = Object.values(bebidas[indice])[1];
                    divPrecio.append(spanPrecio);

                    // div cantidad de la comida en cuestion
                    let divCantidad = document.createElement('div');
                    divCantidad.setAttribute('class','cantidad_producto');
                    let spanCantidad = document.createElement('span');
                    spanCantidad.textContent= Object.values(bebidas[indice])[4];
                    divCantidad.append(spanCantidad);

                    //div subtotal de la comida
                    let divSubtotal = document.createElement('div');
                    divSubtotal.setAttribute('class','subtotal_producto');
                    let spanSubtotal = document.createElement('span');
                    spanSubtotal.textContent = Object.values(bebidas[indice])[5];
                    divSubtotal.append(spanSubtotal);

                    // Boton de eliminar
                    let divEliminar = document.createElement('div');
                    divEliminar.setAttribute('class','eliminar_producto');
                    let boton = document.createElement('button');
                    boton.onclick = async function(){

                        let resDelete = await fetch("http://localhost:3000/eliminarPedidoProducto",{
                            method:'POST',
                            headers:{
                                'Content-Type':'application/json'
                            },
                            body:JSON.stringify({
                                bebida:Object.values(bebidas[indice])[0],
                                tamaño:Object.values(bebidas[indice])[3],
                                user:'karimtec2003@gmail.com'
                            })
                        });

                        if(!resDelete.ok){
                            console.log('Hubo un problema en la comunicacion back-front a la hora de eliminar el pedidoComida');
                        }

                        let resDeleteJson = await resDelete.json();

                        // Actualizar el total
                        if(resDeleteJson.total !== undefined){
                            console.log(resDeleteJson.total);
                            let sTo = document.getElementsByClassName('total')[0];
                            sTo.textContent = 'Total:'+resDeleteJson.total;

                            // No solo debemos actualizar el valor de costo, sino que tambien
                            // debemos de eliminar el div producto en cuestion

                            let dPro = document.getElementById(Object.values(bebidas[indice])[0]);
                            dPro.remove();

                            // Tambien vamos a llamar la funcion eliminar, tranquilo, si no esta vacio no eliminar el pedido
                            eliminarPedido('karimtec2003@gmail.com'); // <-- pasarle como parametro al usuario
                        }


                    }
                    boton.innerHTML = '<i class="bi bi-trash3-fill"></i>';
                    divEliminar.append(boton);


                    divProducto.append(divNombre);
                    divProducto.append(divPrecio);
                    divProducto.append(divCantidad);
                    divProducto.append(divSubtotal);
                    divProducto.append(divEliminar);

                    // toca agregar divProducto al contenedorProductos
                    contenedorProductos.append(divProducto);
                }

                // Una vez que se sumaron todos los subtotales, nos toca renderizar el total
                let sTo = document.getElementsByClassName('total')[0];
                sTo.textContent = 'Total:'+total;

                let botonPago = document.getElementsByClassName('pagar')[0];
                botonPago.onclick = function(){
                    window.location.href = '/procederPago';
                }
            }
            

        }
        else{
            // Significa que el usuario no se ha logueado
            let c = document.getElementsByClassName("mensajeNull")[0];
            let i = document.getElementsByClassName("imagenNull")[0];

            c.style.display = "flex";
            i.style.display = "inline-block";
        }
    }

    
}


pedirPedido();



