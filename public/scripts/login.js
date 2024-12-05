// Esto siempre se tiene que hacer
let btnLog = document.getElementById('logIN/OUT');
    btnLog.innerHTML = `<i class="bi bi-person-circle"></i>`;
    btnLog.addEventListener('click',function(){
        window.location.href = '/login';
});

let btnCrearCuenta = document.getElementById('crear');

    btnCrearCuenta.addEventListener('click',function(){
        window.location.href = '/crear_cuenta';
    });


let formulario = document.getElementsByClassName('login')[0];


formulario.addEventListener('submit',async function(e){

    e.preventDefault();

    let mostrar = document.getElementsByClassName('ponerData')[0];

    let correo = e.target.correo.value;
    let contraseña = e.target.contraseña.value;

    if(!correo || !contraseña){
        // Mostrar en Consola que debe de llenar todos los datos
        mostrar.innerHTML = `Debes de llenar todos los campos  <i class="bi bi-clipboard2-fill"></i>`;
        mostrar.style.backgroundColor = "rgb(255, 251, 0)";
        mostrar.style.display = 'inline-block';
        setTimeout(function(){
            mostrar.style.display = 'none';
        },1500);
        
    }
    else{

        let peticion = await fetch("https://server-production-eeb2.up.railway.app/loginInsert",{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                user:correo,
                pass:contraseña
            })
        });

        if(!peticion.ok){
            console.log('Hubo un error en la comunicacion back-front');
        }

        let peticionJson = await peticion.json();

        if(peticionJson.usuario){
            // Mostrar contenido
            mostrar.innerHTML = `${peticionJson.usuario} <i class="bi bi-exclamation-circle"></i>`;
            mostrar.style.backgroundColor = 'rgb(255, 0, 0)';
            mostrar.style.display = 'inline-block';
            setTimeout(function(){
                mostrar.style.display = 'none';
            },1500);

        }

        if(peticionJson.incorrecta){
            // Mostrar contenido
            mostrar.innerHTML = `${peticionJson.incorrecta} <i class="bi bi-x-circle"></i>`;
            mostrar.style.backgroundColor = 'rgb(255, 0, 0)';
            mostrar.style.display = 'inline-block';
            setTimeout(function(){
                mostrar.style.display = 'none';
            },1500);
        }

        if(peticionJson.redirect){
            console.log('se cumplio esto');
            window.location.href = peticionJson.redirect;
        }
    }
})