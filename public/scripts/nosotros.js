// Esto siempre se tiene que hacer
let btnLog = document.getElementById('logIN/OUT');
btnLog.innerHTML = `<i class="bi bi-person-circle"></i>`;
btnLog.addEventListener('click',function(){
    window.location.href = '/login';
});



async function llamada(){

    let respuesta = await fetch("http://localhost:3000/nosotrosLogin",{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        }
    });

    if(!respuesta.ok){
        console.log('Hubo un error con la comunicacion back-front');
    }

    let respuestaJson = await respuesta.json();

    if(respuestaJson.logueado != undefined){
        
        let logueado = respuestaJson.logueado;

        if(logueado == true){

            // Usuario logueado
            btnLog.innerHTML = `<i class="bi bi-door-open-fill"></i>`;
            btnLog.addEventListener('click', function(){

                // Eliminar la cookie de login
                document.cookie = "megumin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

                // volver a poner el Diseno como estaba antes
                btnLog.innerHTML = `<i class="bi bi-person-circle"></i>`;
                btnLog.addEventListener('click',function(){
                    window.location.href = '/login';
                })
            });
            
        }
    }
}

llamada()