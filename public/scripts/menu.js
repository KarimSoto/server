async function PedirMenu(){

    // Esto siempre se tiene que hacer
    let btnLog = document.getElementById('logIN/OUT');
    btnLog.innerHTML = `<i class="bi bi-person-circle"></i>`;
    btnLog.addEventListener('click',function(){
        window.location.href = '/login';
    });


    const respuesta = await fetch("https://server-production-eeb2.up.railway.app/menu",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        }
    });


    if(!respuesta.ok){
        console.log('Hubo un error en la comunicacion back-front');
    }

    const respuestaJSON = await respuesta.json();
   

    if(respuestaJSON.arreglo_comida){
        var comidas = respuestaJSON.arreglo_comida;
    }

    if(respuestaJSON.arreglo_bebida){
        var bebidas = respuestaJSON.arreglo_bebida;
    }

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

        }
    }


    console.log(comidas);
    console.log(bebidas);

    let menu = document.getElementById('platillos');

    for(let iterador in comidas){

        let comida = document.createElement('div');
        comida.setAttribute('id','card');  // <-- Le dara el diseno del css

        let  img = document.createElement('img');
        img.src = comidas[iterador].img;

        let  caption = document.createElement('div');
        caption.setAttribute('id','caption');  // <-- Le dara el diseno del css
        caption.textContent = comidas[iterador].nombre_comida;

        comida.append(img);
        comida.append(caption);


        comida.addEventListener('click',function(){
            sessionStorage.setItem('producto',comidas[iterador].nombre_comida);
            window.location.href = '/producto';
        });

        menu.append(comida);
    }

    for(let iterador in bebidas){

        let bebida = document.createElement('div');
        bebida.setAttribute('id','card');  // <-- Le dara el diseno del css

        let  img = document.createElement('img');
        img.src = bebidas[iterador].img;

        let  caption = document.createElement('div');
        caption.setAttribute('id','caption');  // <-- Le dara el diseno del css
        caption.textContent = bebidas[iterador].nombre_bebida;

        bebida.append(img);
        bebida.append(caption);


        bebida.addEventListener('click',function(){
            sessionStorage.setItem('producto',bebidas[iterador].nombre_bebida);
            window.location.href = '/producto';
        });

        menu.append(bebida);

    }
    
}


PedirMenu();