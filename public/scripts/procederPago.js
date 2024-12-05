async function pedirORDER(){

    // Esto siempre se tiene que hacer
    let btnLog = document.getElementById('logIN/OUT');
    btnLog.innerHTML = `<i class="bi bi-person-circle"></i>`;
    btnLog.addEventListener('click',function(){
        window.location.href = '/login';
    });

    let response = await fetch("https://server-production-eeb2.up.railway.app/carrito_tarjetas",{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        }
    });

    if(!response.ok){
        console.log('Hubo un error en la comunicacion back-front');
    }

    const responseJson = await response.json();

    if(responseJson.tarjetas){
        var tarjetas = responseJson.tarjetas;
        console.log(tarjetas);
    }

    if(responseJson.comidas){
        var comidas = responseJson.comidas;
        console.log(comidas);
    }

    if(responseJson.bebidas){
        var bebidas = responseJson.bebidas;
        console.log(bebidas);
    }

    if(respuestaJson.logueado != undefined){
        
        let logueado = respuestaJson.logueado;

        if(logueado != false){
            
            btnLog.innerHTML = `<i class="bi bi-door-open-fill"></i>`;
            btnLog.addEventListener('click',function(){
                document.cookie = "megumin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            
                btnLog.innerHTML = `<i class="bi bi-person-circle"></i>`;
                btnLog.addEventListener('click',function(){
                    window.location.href = '/login';
                });
            });

        }
    }


    // Toca interactuar con el DOM

    let productos = document.getElementsByClassName('productos')[0];

    for(let indice in comidas){

        let divProducto = document.createElement('div');
        divProducto.setAttribute('class','producto');


        // div Nombre
        let divNombre = document.createElement('div');
        divNombre.setAttribute('class','nombre_producto');
        let spanNombre = document.createElement('span');
        spanNombre.textContent = Object.values(comidas[indice])[0];
        divNombre.append(spanNombre);


        // div Precio
        let divPrecio = document.createElement('div');
        divPrecio.setAttribute('class','precio_producto');
        let spanPrecio = document.createElement('span');
        spanPrecio.textContent = Object.values(comidas[indice])[1];
        divPrecio.append(spanPrecio);


        // div Cantidad
        let divCantidad = document.createElement('div');
        divCantidad.setAttribute('class','cantidad_producto');
        let spanCantidad = document.createElement('span');
        spanCantidad.textContent = Object.values(comidas[indice])[3];
        divCantidad.append(spanCantidad);

        // div Subtotal
        let divSubtotal = document.createElement('div');
        divSubtotal.setAttribute('class','subtotal_producto');
        let spanSubtotal = document.createElement('span');
        spanSubtotal.textContent = Object.values(comidas[indice])[4];
        divSubtotal.append(spanSubtotal);

        divProducto.append(divNombre);
        divProducto.append(divPrecio);
        divProducto.append(divCantidad);
        divProducto.append(divSubtotal);

        productos.append(divProducto);
    }

    for(let indice in bebidas){

        let divProducto = document.createElement('div');
        divProducto.setAttribute('class','producto');


        // div Nombre
        let divNombre = document.createElement('div');
        divNombre.setAttribute('class','nombre_producto');
        let spanNombre = document.createElement('span');
        spanNombre.textContent = Object.values(bebidas[indice])[0] + ' ' + Object.values(bebidas[indice])[3];
        divNombre.append(spanNombre);


        // div Precio
        let divPrecio = document.createElement('div');
        divPrecio.setAttribute('class','precio_producto');
        let spanPrecio = document.createElement('span');
        spanPrecio.textContent = Object.values(bebidas[indice])[1];
        divPrecio.append(spanPrecio);


        // div Cantidad
        let divCantidad = document.createElement('div');
        divCantidad.setAttribute('class','cantidad_producto');
        let spanCantidad = document.createElement('span');
        spanCantidad.textContent = Object.values(bebidas[indice])[4];
        divCantidad.append(spanCantidad);

        // div Subtotal
        let divSubtotal = document.createElement('div');
        divSubtotal.setAttribute('class','subtotal_producto');
        let spanSubtotal = document.createElement('span');
        spanSubtotal.textContent = Object.values(bebidas[indice])[5];
        divSubtotal.append(spanSubtotal);

        divProducto.append(divNombre);
        divProducto.append(divPrecio);
        divProducto.append(divCantidad);
        divProducto.append(divSubtotal);

        productos.append(divProducto);
    }

    for(let indice in tarjetas){
        let divTarjeta = document.createElement('div');
        divTarjeta.setAttribute('class','tarjeta');

        divTarjeta.innerHTML = `
            <div class="up">
                        <img src="/images/card_chip.png">
                        <div class="circle"></div>
            </div>
            <div class="down">
                <div class="s1"></div>
                <div class="s2"></div>
                <div class="s3"></div>
                <div class="last4digits">
                    ${Object.values(tarjetas[indice])[0]}
                </div>
            </div>
        `;

        let divAllCards = document.getElementsByClassName('tarjetas_user')[0];
        let btn_agregar = document.getElementById('addNewCard');
        divAllCards.insertBefore(divTarjeta,btn_agregar);
    }

    let goBackbtn = document.getElementById('goBack');
    goBackbtn.onclick = function(){
        window.location.href = '/menu';
    }

    let EndBtn = document.getElementById('End_order');
    EndBtn.onclick = async function(){

        // Debemos de finalizar la compra
        let respuestaFinal = await fetch("https://server-production-eeb2.up.railway.app/finalizarPedido",{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                card:'3094'
            })
        });

        if(!respuestaFinal.ok){
            console.log('Hubo un error en la comunicacion back-front');
        }


        let finalJson = await respuestaFinal.json();

        if(finalJson.finalizacion){
            let finalizacion = finalJson.finalizacion;

            if(finalizacion == 1){
                // mandar a llamar a la funcion congratulations
                congratulations();
            }
        }
    }
}

pedirORDER();


function congratulations(){
    let divD = document.getElementsByClassName('display')[0];

    divD.style.display = 'flex';

    setTimeout(function(){
        window.location.href = '/inicio';
    },2000);

}