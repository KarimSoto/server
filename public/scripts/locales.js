async function PedirLocales(){

    // Esto siempre se tiene que hacer
    let btnLog = document.getElementById('logIN/OUT');
    btnLog.innerHTML = `<i class="bi bi-person-circle"></i>`;
    btnLog.addEventListener('click',function(){
        window.location.href = '/login';
    });


    const respuesta = await fetch("http://localhost:3000/locales",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        }
    });

    let locales = [];

    if(!respuesta.ok){
        console.log('Hubo un error en la comunicacion back-front');
    }else{

        let respuestaJson = await respuesta.json();


        if(respuestaJson.locales){
            locales = respuestaJson.locales;
        }

        if(respuestaJson.logueado != undefined){
        
            let logueado = respuestaJson.logueado;
    
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

            }
        }
    }

    console.log(locales);


    let contenedor = document.getElementById('contenedor');


    for(let iterador in locales){
        let divLocal = document.createElement('div');
        divLocal.setAttribute('id','local');

        let imagen = document.createElement('img');
        imagen.src = locales[iterador].img;


        let divInfo = document.createElement('div');
        divInfo.setAttribute('id','info');


        // Creacion de nameSucursal
        let divName = document.createElement('div');
        divName.setAttribute('id','nameSucursal');
        divName.textContent = 'Sucursal'+locales[iterador].colonia;
        // fin de la creacion de nameSucursal



        // Creacion de SUCURSAL

        let divSucursal = document.createElement('div');
        divSucursal.setAttribute('id','sucursal');


            // ----- Horarios -----
            let divHorarios = document.createElement('div');
            divHorarios.setAttribute('id','horarios');
            divHorarios.innerHTML = `
                <span>Horarios</span>
                <span>Lunes:${locales[iterador].lunes}</span>
                <span>Martes:${locales[iterador].martes}</span>
                <span>Miercoles:${locales[iterador].miercoles}</span>
                <span>Jueves:${locales[iterador].jueves}</span>
                <span>Viernes:${locales[iterador].viernes}</span>
                <span>Sabado:${locales[iterador].sabado}</span>
                <span>Domingo:${locales[iterador].domingo}</span>
            `;
            // ----- Horarios -----



            // ----- DIRECCION ------
            let divDireccion = document.createElement('div');
            divDireccion.setAttribute('id','direccion');
            divDireccion.innerHTML = `
                <span>Calle: ${locales[iterador].calle}</span>
                <span>Numero: #${locales[iterador].numero}</span>
                <span>Colonia: ${locales[iterador].colonia}</span>
                <span>Ciudad: ${locales[iterador].ciudad}</span>
            `;
            // ----- DIRECCION ------

        divSucursal.append(divHorarios);
        divSucursal.append(divDireccion);

        // Fin de la creacion de SUCURSAL

        divInfo.append(divName)
        divInfo.append(divSucursal);


        divLocal.append(imagen);
        divLocal.append(divInfo);


        // Al final de todo debemos de agregar el local al contenedor global
        contenedor.append(divLocal);
        
    }


}




PedirLocales();