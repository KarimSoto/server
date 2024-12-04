// Esto siempre se tiene que hacer
let btnLog = document.getElementById('logIN/OUT');
    btnLog.innerHTML = `<i class="bi bi-person-circle"></i>`;
    btnLog.addEventListener('click',function(){
        window.location.href = '/login';
    });


async function llamarInicio(){

    let respuesta = await fetch('http://localhost:3000/inicioPOST',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        }
    });

    if(!respuesta.ok){
        console.log('Hubo un error en la comunicacion back-front')
    }

    let respuestaJson = await respuesta.json();

    if(respuestaJson.logueado){

        let logueado = respuestaJson.logueado;

        if(logueado == true){
            
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


    let arreglo = [
        {
            img:"https://us.oricon-group.com/upimg/detail/0/498/img660/3aede628af0f88bca6b4909a7ce3c74c.jpg",
            encabezado:'Panqueques',
            texto:'Los panqueues son la comida favorita del pekka'
        },
        {
            img:"https://otakukart.com/wp-content/uploads/2023/11/My-Web-Game-Wife-Is-A-Popular-Idol-IRL-Credits-Comic-Gardo-1-scaled.jpg",
            encabezado:'Waffles Americanos',
            texto:'Adoro los waffles, me encanta llenarlos de cum'
        },
    ];



    let contenedorPadre = document.getElementsByClassName('carousel')[0];


    for(let i in arreglo){

        let clase = `d${parseInt(i)+1}`;

        let div = document.createElement('div');
        div.setAttribute('class',clase+" con");   // clase = "d# con"

        // Crear div Contenido
        let divContenido = document.createElement('div');
        divContenido.setAttribute('class','contenido');


            // Crear la izquierda
            let ConIz = document.createElement('div');
            ConIz.setAttribute('class','izquierda');

            let iz = document.createElement('i');
            iz.setAttribute('class','bi bi-caret-left-fill');

            ConIz.append(iz);
            ConIz.addEventListener('click',function(){
                let cantidad = (contenedorPadre.clientWidth);
                let posicion_inicial = (contenedorPadre.scrollLeft);
                posicion_inicial = Math.round(posicion_inicial/cantidad);
                posicion_inicial = cantidad * (posicion_inicial);     //   822 * 2


                let donde_llegar = 0;
                let diferencia = contenedorPadre.scrollLeft - cantidad;

                console.log(contenedorPadre.scrollLeft);
                console.log(cantidad);


                if(posicion_inicial != 0){
                    // Significa que no estamos en el inicio

                    if(contenedorPadre.scrollLeft != posicion_inicial){

                        cantidad = cantidad + diferencia;
                        donde_llegar = contenedorPadre.scrollLeft - cantidad;

                        console.log("#######################");
                        console.log(contenedorPadre.scrollLeft);
                        console.log(cantidad);
                        console.log(donde_llegar);
                    }
                    else{
                        if(contenedorPadre.scrollLeft == posicion_inicial){
                            console.log('naruto');
                            donde_llegar = posicion_inicial - cantidad;
                        }
                        
                    }

                    
                }

                let intervalo;
                let avanze = Math.round(cantidad/10);

                // Declarar funcion, todavia no la usamos
                function disminuir(){
                    if(contenedorPadre.scrollLeft > donde_llegar){
                        // Significa que todavia nos hace falta camino por recorrer

                        if(contenedorPadre.scrollLeft-avanze < donde_llegar){
                            // No permitirle llegar sobrepasarse
                            console.log("uno");
                            contenedorPadre.scrollLeft = donde_llegar
                        }
                        else{
                            console.log('dos');
                            console.log(avanze);
                            
                            let previous_value = contenedorPadre.scrollLeft;
                            console.log(previous_value - avanze);
                            contenedorPadre.scrollLeft = previous_value - avanze;
                            
                        }

                    }
                    else{
                        // para el setInterval
                        clearInterval(intervalo);
                        console.log('se elimino un intervalo');
                    }
                    
                }

                // Si esto no se cumple, todavia no hemos llegado al final
                if(posicion_inicial > 0){
                    intervalo = setInterval(disminuir,1500)
                }
                else{
                    console.log('Ya estas en el inicio, no puedes avanzar mas a la izquierda');
                }
            });
            // Fin izquierda


            // Crear Imagen
            let img = document.createElement('img');
            img.src = arreglo[i].img;
            // Fin imagen


            // Crear la derecha
            let ConDe = document.createElement('div');
            ConDe.setAttribute('class','derecha');

            let de = document.createElement('i');
            de.setAttribute('class','bi bi-caret-right-fill');

            ConDe.append(de);
            ConDe.addEventListener('click',function(){

                let cantidad = contenedorPadre.clientWidth;
                let posicion_inicial = contenedorPadre.scrollLeft
                let donde_llegar = posicion_inicial + cantidad;
                let intervalo;

                console.log(cantidad);
                console.log(posicion_inicial);
                console.log(donde_llegar);

                // Declarar funcion, todavia no la usamos
                function aumentar(){
                    if(contenedorPadre.scrollLeft < donde_llegar){
                        // Significa que todavia nos hace falta camino por recorrer
                        contenedorPadre.scrollLeft+=cantidad/10;
                    }
                    else{
                        // para el setInterval
                        clearInterval(intervalo);
                        console.log('se elimino un intervalo');
                    }
                    
                }

                // Si esto no se cumple, todavia no hemos llegado al final
                if(posicion_inicial < contenedorPadre.scrollWidth){
                    intervalo = setInterval(aumentar,40)
                }
                else{
                    console.log('llegaste al final');
                }

                
            });
            // Fin derecha




        divContenido.append(ConIz);
        divContenido.append(img);
        divContenido.append(ConDe);

        // Fin div Contenido


        // Crear div Caption
        let divCaption = document.createElement('div');
        divCaption.setAttribute('class','caption');
        divCaption.innerHTML = `
            <span>${arreglo[i].encabezado}</span>
            <p>${arreglo[i].texto}</p>
        `;
        // Fin div Caption


        // Agregar el contenido y el caption a todo el div
        div.append(divContenido);
        div.append(divCaption);

        contenedorPadre.append(div);



    }

    



}

llamarInicio();