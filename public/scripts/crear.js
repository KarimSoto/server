let pass = document.getElementById('contraseña');
let confirmar = document.getElementById('hidden');
let mostrar = document.getElementsByClassName('ponerData')[0];

pass.addEventListener('keydown',function(event){

    let minuscula_REGEX = /[a-z]/;
    let mayuscula_REGEX = /[A-Z]/;
    let numero_REGEX = /[0-9]/;
    let caracter_REGEX = /\$|#|@|%|\!|\+|-|&|\^|\?|\*|_|~/;


    // verificar que la contrasena, el correo y el numero sean unicos
    if(minuscula_REGEX.test(password) && mayuscula_REGEX.test(password) && numero_REGEX.test(password) && caracter_REGEX.test(password)){
        // La contrasena cumple con los requisitos
        
    }


    if(event.key == 'Enter'){
        event.preventDefault();
        confirmar.style.display="flex";
        confirmar.style.position="relative";
        confirmar.style.flexDirection="column";
    }
});


let form = document.getElementById('create');

form.addEventListener('submit',async function(event){
    event.preventDefault();

    console.log(event.target.nombre.value);

    let res = await fetch('http://localhost:3000/account',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({
            name:event.target.nombre.value,
            lastname:event.target.apellido.value,
            email:event.target.correo.value,
            number:event.target.numero.value,
            password:event.target.contraseña.value,
            confirmation:event.target.confirmar.value
        })
    });

    if(!res.ok){
        console.log('Hubo un error en la comunicacion back-front');
    }

    let respuestaJson = await res.json();

    if(respuestaJson.message){
        mostrar.innerHTML = `${respuestaJson.message}  <i class="bi bi-clipboard2-fill"></i>`;
        mostrar.style.backgroundColor = "rgb(255, 251, 0)";
        mostrar.style.display = 'inline-block';
        setTimeout(function(){
            mostrar.style.display = 'none';
        },1500);
    }
    
});