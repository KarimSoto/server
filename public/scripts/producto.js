async function detallesDelProducto(){

    // Esto siempre se tiene que hacer
    let btnLog = document.getElementById('logIN/OUT');
    btnLog.innerHTML = `<i class="bi bi-person-circle"></i>`;
    btnLog.addEventListener('click',function(){
        window.location.href = '/login';
    });

    const producto = sessionStorage.getItem('producto');

    const respuesta = await fetch('http://localhost:3000/producto',{
        method:'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            producto:producto
        })
    });


    if(!respuesta.ok){
        console.log('Hubo un problema en la comunicacion back-front');
    }
    
    const respuestaJSON = await respuesta.json();


    if(respuestaJSON.productos){
        var FoodDrink = respuestaJSON.productos;
        console.log(FoodDrink);
    }

    if(respuestaJSON.logueado != undefined){
        
        let logueado = respuestaJSON.logueado;

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


    let contenedor_venta = document.getElementById('contenedor_venta');


    let showSize = 0;    // El que nos dira que tamano podemos usar
    let cantidadGlobal=1;


    let presentacionVenta = document.createElement('div');
    presentacionVenta.setAttribute('id','presentacion_venta');

    let imagen = document.createElement('img');
    imagen.src = FoodDrink[0].img;

    let caption = document.createElement('div');
    caption.setAttribute('id','caption');
    caption.textContent = Object.values(FoodDrink[0])[0];


    presentacionVenta.append(imagen);
    presentacionVenta.append(caption);



    // Si lo que retorno es de tipo bebidas, habra botones para elegir el tamano
    if(Object.keys(FoodDrink[0])[0] == 'nombre_bebida'){
        let infoVentas = [];
           
    
        for(let llave in FoodDrink){
            // Crear un info venta por cada bebida, si es comida, se creara una sola
            let divInfoVenta = document.createElement('div');
            divInfoVenta.setAttribute('class','info_venta');
    
    
            // Inicio Tamaño 
            let divTamaño = document.createElement('div');
            divTamaño.setAttribute('class','tamaño');
    
            for(let i in FoodDrink){
                let btn = document.createElement('button');
                btn.textContent = FoodDrink[i].tamaño
                btn.onclick = function(){
                    showSize = i;
                    contenedor_venta.removeChild(contenedor_venta.lastChild);
                    contenedor_venta.append(infoVentas[showSize]);

                    let phijo = infoVentas[showSize].children[1];
                    let pnieto = phijo.children[0];



                    let hijo = infoVentas[showSize].children[2]; // <-- Acceder al tercer hijo
                    let nieto = hijo.children[1]; // <---- Acceder al segundo hijo
                    nieto.textContent = cantidadGlobal;

                    let hijo2 =infoVentas[showSize].children[3]; 
                    let nieto2 = hijo2.children[0];
                    nieto2.textContent = cantidadGlobal * parseFloat(pnieto.textContent);
                }
                divTamaño.append(btn);
    
            }
            // Fin Tamaño
    

            // Inicio Precio
            let divPrecio = document.createElement('div');
            divPrecio.setAttribute('class','precio');
            let spanPrecio = document.createElement('span');
            spanPrecio.textContent = FoodDrink[llave].precio;
            divPrecio.append(spanPrecio);
            // Fin Precio
    
            // Inicio Cantidad
            let divCantidad =  document.createElement('div');
            divCantidad.setAttribute('class','cantidad');
    
            let spanCantidad = document.createElement('span');
            spanCantidad.textContent = '1';
    
    
            let btnMenos = document.createElement('button');
            btnMenos.onclick = function(){
                cantidadGlobal--;
                number = cantidadGlobal;
                spanCantidad.textContent = `${number}`;
                spanSubtotal.textContent = `${parseFloat(number * FoodDrink[llave].precio)}`;
            }
            btnMenos.textContent = '-';
    
    
            let btnMas =  document.createElement('button');
            btnMas.onclick = function(){
                cantidadGlobal++;
                number = cantidadGlobal;
                spanCantidad.textContent = `${number}`;
                spanSubtotal.textContent = `${parseFloat(number * FoodDrink[llave].precio)}`;
            }
            btnMas.textContent = '+';
    
            divCantidad.append(btnMenos);
            divCantidad.append(spanCantidad);
            divCantidad.append(btnMas);
            // Fin Cantidad
    
    
            // Subtotal
            let divSubtotal = document.createElement('div');
            divSubtotal.setAttribute('class','subtotal');
    
            let spanSubtotal = document.createElement('span');
            spanSubtotal.textContent = `${1 * FoodDrink[llave].precio}`; // darle el valor inicial
    
            divSubtotal.append(spanSubtotal);
    
            // Inicio Añadir
            let divAñadir = document.createElement('div');
            divAñadir.setAttribute('class','añadir');
    
            let btnAñadir = document.createElement('button');
            btnAñadir.onclick = async function(){
                // aqui tenemos que redirigir al carrito, y para que pueda ver su compra
                console.log('hiciste click');

                // ademas de que si estamos aqui, es porque es de tipo bebida
                const respuesta = await fetch("http://localhost:3000/addPedido",{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        bebida: Object.values(FoodDrink[showSize])[0],
                        tamaño: Object.values(FoodDrink[showSize])[4],
                        cantidad:cantidadGlobal
                    })
                });


                if(!respuesta.ok){
                    console.log('Hubo un error en la comunicacion back-front');
                }


                const respuestaJSON = await respuesta.json();

                if(respuestaJSON.redirect){
                    // Si todo salio bien, entonces redireccionar al usuario
                    window.location.href = respuestaJSON.redirect;
                }

                if(respuestaJSON.logueado == false){
                    console.log('logueado');

                    // Mostrar en Consola que debe de llenar todos los datos
                    let mostrar = document.getElementsByClassName('ponerData')[0];
                    mostrar.innerHTML = `Debes iniciar sesion primero <i class="bi bi-person-lock"></i>`;
                    mostrar.style.backgroundColor = "rgb(255, 251, 0)";
                    mostrar.style.display = 'inline-block';
                    setTimeout(function(){
                        mostrar.style.display = 'none';
                    },1500);
                    
                }
            }
            btnAñadir.textContent = 'añadir';
            divAñadir.append(btnAñadir);
            // Fin Añadir
    
            divInfoVenta.append(divTamaño);
            divInfoVenta.append(divPrecio);
            divInfoVenta.append(divCantidad);
            divInfoVenta.append(divSubtotal);
            divInfoVenta.append(divAñadir);
    
            infoVentas.push(divInfoVenta);
        }
    
    
        // Agregar al contenedor principal
        contenedor_venta.append(presentacionVenta);
        contenedor_venta.append(infoVentas[0]);
    }
    else{
        // Si estamos aqui es porque el objeto tal ves sea de comida
        if(Object.keys(FoodDrink[0])[0] == 'nombre_comida'){
            // si se cumple este if, entonces si, selecciono una comida
            let divInfoVenta = document.createElement('div');
            divInfoVenta.setAttribute('class','info_venta');

            // Inicio Precio
            let divPrecio = document.createElement('div');
            divPrecio.setAttribute('class','precio');
            let spanCaptionPrecio = document.createElement('span');
            let spanPrecio = document.createElement('span');
            spanCaptionPrecio.textContent = "Precio Unitario:";
            spanPrecio.textContent = FoodDrink[0].precio;
            divPrecio.append(spanCaptionPrecio);
            divPrecio.append(spanPrecio);
            // Fin Precio


            // Inicio Cantidad
            let divCantidad =  document.createElement('div');
            divCantidad.setAttribute('class','cantidad');
     
            let spanCaptionCantidad = document.createElement('span');
            let spanCantidad = document.createElement('span');
            spanCaptionCantidad.textContent = "Cantidad:";
            spanCantidad.textContent = '1';
     
     
            let btnMenos = document.createElement('button');
            btnMenos.onclick = function(){
                 cantidadGlobal--;
                 let number = cantidadGlobal;
                 spanCantidad.textContent = `${number}`;
                 spanSubtotal.textContent = `${parseFloat(number * FoodDrink[0].precio)}`;
            }
            btnMenos.textContent = '-';
     
     
            let btnMas =  document.createElement('button');
            btnMas.onclick = function(){
                cantidadGlobal++;
                let number = cantidadGlobal;
                spanCantidad.textContent = `${number}`;
                spanSubtotal.textContent = `${parseFloat(number * FoodDrink[0].precio)}`;
            }
            btnMas.textContent = '+';
     
            divCantidad.append(spanCaptionCantidad);
            divCantidad.append(btnMenos);
            divCantidad.append(spanCantidad);
            divCantidad.append(btnMas);
            // Fin Cantidad



            // Inicio Subtotal
            let divSubtotal = document.createElement('div');
            divSubtotal.setAttribute('class','subtotal');
    
            let spanCaptionSubtotal = document.createElement('span');
            let spanSubtotal = document.createElement('span');
            spanCaptionSubtotal.textContent = "Monto:";
            spanSubtotal.textContent = `${1 * FoodDrink[0].precio}`; // darle el valor inicial
    
            divSubtotal.append(spanCaptionSubtotal);
            divSubtotal.append(spanSubtotal);
            // Fin Subtotal


            // Inicio Añadir
            let divAñadir = document.createElement('div');
            divAñadir.setAttribute('class','añadir');
    
            let btnAñadir = document.createElement('button');
            btnAñadir.onclick = async function(){
                // aqui tenemos que redirigir al carrito, y para que pueda ver su compra


                // ademas de que si estamos aqui, es porque es de tipo bebida
                const respuesta = await fetch("http://localhost:3000/addPedido",{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        comida: Object.values(FoodDrink[0])[0],
                        cantidad:cantidadGlobal
                    })
                });


                if(!respuesta.ok){
                    console.log('Hubo un error en la comunicacion back-front');
                }


                const respuestaJSON = await respuesta.json();

                if(respuestaJSON.redirect){
                    // Si todo salio bien, entonces redireccionar al usuario
                    window.location.href = respuestaJSON.redirect;
                }
            }
            btnAñadir.textContent = 'añadir';
            divAñadir.append(btnAñadir);
            // Fin Añadir


            divInfoVenta.append(divPrecio);
            divInfoVenta.append(divCantidad);
            divInfoVenta.append(divSubtotal);
            divInfoVenta.append(divAñadir);

            contenedor_venta.append(presentacionVenta);
            contenedor_venta.append(divInfoVenta);

        }
    }
    


}


detallesDelProducto();