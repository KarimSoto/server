import mysql, { format } from "mysql2";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { methods as metodos , carritoTemporal } from "./inserciones.js";


dotenv.config({path:'../.env'});

async function comidas(request,response){

    let preBebida = false;
    let preComida = false;
    let arreglo_comida = [];
    let arreglo_bebida = [];

    try{
        let query = 'call obtenerPresentacionComidas()';
        let [results] = await request.database.query(mysql.format(query));

        for(let result_key in results[0]){
            let comida = {};
            // En este caso los unidos elementos de cada objeto seran img y nombre
            for(let key in results[0][result_key]){
                comida[key] = results[0][result_key][key];
            }
            arreglo_comida.push(comida);
        }

        preComida = true;
    }
    catch(error){
        throw error;
    }


    try{
        let query2 = "call obtenerPresentacionBebidas()";

        let [results2] = await request.database.query(mysql.format(query2));

        for(let results2_key in results2[0]){
            let bebida={};

            for(let key in results2[0][results2_key]){
                bebida[key] = results2[0][results2_key][key];
            }

            arreglo_bebida.push(bebida);
        }

        preBebida = true;
    }
    catch(error){
        throw error;
    }


    if(preComida && preBebida){
       console.log(arreglo_comida);
       console.log(arreglo_bebida);
       let to_login = await logueado(request);
       response.status(200).send({arreglo_comida:arreglo_comida,arreglo_bebida:arreglo_bebida,logueado:to_login});
    }

}



async function locales(request,response){

    let locales = [];
    
    try{
        let query = "call showLocales()"
        let [results] = await request.database.query(mysql.format(query));

        // el [0] es el que almacena solo lo que devuelve el select
        for(let llave in results[0]){
            let local = {}

            // vamos a obtener todos los valores del objeto en cuestion (local)
            for(let indice in results[0][llave]){
                local[indice] = results[0][llave][indice];    // <-- asegurarnos de que tengan el mismo nombre
            }

            locales.push(local);   // agregar el objeto creado a la lista de locales
        }

        console.log(locales);

    }
    catch(error){
        console.log(error);
    }   

    let to_login = await logueado(request);
    response.status(200).send({locales:locales,logueado:to_login});

}



async function producto(request,response){

    const nombre_producto = request.body.producto;

    let productos = [];


    try{
        let query = "call FOOD_OR_DRINK(?)";
        let params = [nombre_producto];
        let [results] = await request.database.query(mysql.format(query,params));
    
        for(let iterador in results[0]){
            let objeto = {};
    
            for(let llave in results[0][iterador]){
                objeto[llave] = results[0][iterador][llave];
            }
    
            productos.push(objeto);
            console.log(productos);
        }
    }
    catch(error){
        console.log(error);
    }

    let to_login = await logueado(request);
    response.status(200).send({productos:productos,logueado:to_login});
    
}


async function pedido(request,response){

    let user = await logueado(request);
    if(user != false){
        
        let params = [user];

        let comidas =[];
        let bebidas = [];
        
        try{
    
            let query = "call comidas_en_el_carrito(?)";
            let [results] = await request.database.query(mysql.format(query,params));
            
        
            for(let indice in results[0]){
                let objeto = {};
                for(let llave in results[0][indice]){
                    objeto[llave] = results[0][indice][llave];
                }
                comidas.push(objeto);
            }
        }
        catch(error){
            console.log(error);
        }
    
        
      
    
    
        try{
            let query2 = "call bebidas_en_el_carrito(?)";
            let [results2] = await request.database.query(mysql.format(query2,params));
    
            for(let indice in results2[0]){
                let objeto = {};
                for(let llave in results2[0][indice]){
                    objeto[llave] = results2[0][indice][llave];
                }
                bebidas.push(objeto);
            }
        }
        catch(error){
            console.log(error);
        }
    
        let to_login = await logueado(request);
        response.status(200).send({comidas:comidas,bebidas:bebidas,logueado:to_login});
    }
    else{

        let comidas = carritoTemporal.obtenerComidas();
        let bebidas = carritoTemporal.obtenerBebidas();

        // Retornas las comidas y bebidas que el usuario haya almacenado de forma temporal
        response.status(200).send({comidas:comidas,bebidas:bebidas,logueado:false});
        
    }
    
}


async function cards_and_cart(request,response){

    let user = await logueado(request);

    if(user != false){

        let params = [user];
        let tarjetas = [];
        let comidas = [];
        let bebidas = [];
    
        try{

            let q1 = "call showTarjetas(?)";
            
    
            let [rs1] = await request.database.query(mysql.format(q1,params));
    
            for(let indice in rs1[0]){
                let objeto = {};
                for(let llave in rs1[0][indice]){
                    objeto[llave] = rs1[0][indice][llave];
    
                    if(llave == 'no_tarjeta'){
                        let longitud = objeto[llave].length;
                        objeto[llave] = objeto[llave].slice(longitud-4,longitud);
                    }
                }
                tarjetas.push(objeto);
            }
    
        }
        catch(error){
            console.log(`Error en la consulta :"call showTarjetas(${user})"`);
            console.log(error);
    
        }
    
    
        try{
            let q2 = "call comidas_en_el_carrito(?)";
    
            let [rs2] = await request.database.query(mysql.format(q2,params));
    
            for(let indice in rs2[0]){
                let objeto = {};
                for(let llave in rs2[0][indice]){
                    objeto[llave] = rs2[0][indice][llave];
                }
                comidas.push(objeto);
            }
        }
        catch(error){
            console.log(`Error en la consulta :"call comidas_en_el_carrito(${user})"`);
            console.log(error);
        }
    
    
    
        try{
            let q3 = "call bebidas_en_el_carrito(?)";
    
            let [rs3] = await request.database.query(mysql.format(q3,params));
    
            for(let indice in rs3[0]){
                let objeto = {};
                for(let llave in rs3[0][indice]){
                    objeto[llave] = rs3[0][indice][llave];
                }
                bebidas.push(objeto);
            }
        }
        catch(error){
            console.log(`Error en la consulta :"call bebidas_en_el_carrito(${user})"`);
            console.log(error);
        }
    
        let to_login = await logueado(request);
        response.status(200).send({tarjetas:tarjetas,comidas:comidas,bebidas:bebidas,logueado:to_login});


    }
    else{
        console.log('El usuario no esta logueado');
    }
    
}

async function Login(request,response){

    let user = request.body.user;
    let pass = request.body.pass;

    let query = "call getCliente(?)";
    let params = [user];

    let sl = await bcryptjs.genSalt(5);
    console.log(await bcryptjs.hash(pass,sl));

    let [results] = await request.database.query(mysql.format(query,params));

    if(results[0][0] == undefined){
        return response.status(200).send({usuario:`El usuario ${user} no existe`});
    }
    else{
        let passDB = results[0][0].contraseña;
    
        let ok = await bcryptjs.compare(pass,passDB);
    
    
        if(ok){
            // Usuario Logueado
            let token = jsonwebtoken.sign(
                {
                    user:results[0][0].correo_cliente
                },
                "Miku's headphones",
                {
                    expiresIn:"1d"
                }
            );


            let cookie_configuration = {
                expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 20 * 60 * 1000), // 20 min
                path:"/"
            }


            response.cookie("megumin",token,cookie_configuration);
            response.status(200).send({redirect:'/inicio'});
        }
        else{
            // Uusario no logueado
            return response.status(200).send({incorrecta:'Tu contraseña es incorrecta'});
        }
    }

    

}


async function logueado(request){
    let logueado = false;
    let userLogin = "";

    if(request.headers.cookie == undefined){
        logueado = false;
    }
    else{
        let galletas = request.headers.cookie.split("; ");
        let galleta = galletas.find(galleta => galleta.startsWith("megumin="));

        if(galleta){
            galleta = galleta.slice(8);

            let decodificada = await jsonwebtoken.verify(galleta, "Miku's headphones"); // decodificar galleta 


            logueado = true;
            userLogin = decodificada.user;
        }
    }

    if(logueado){
        return userLogin;
    }
    else{
        return logueado;
    }
}



async function mensaje(request,response){
    let user = await logueado(request);

    if(user != false){
        response.status(200).send({logueado:true});
    }
    else{
        response.status(200).send({logueado:false});
        console.log('El usuario no esta logueado');
    }
}

export const methods = {
    comidas,
    locales,
    producto,
    pedido,
    cards_and_cart,
    Login,
    logueado,
    mensaje
}