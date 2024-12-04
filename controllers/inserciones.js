import mysql from "mysql2";
import { methods as funciones } from "./retornos.js";


async function addPedido_producto(request, response){
    
    let user = await funciones.logueado(request);

    if(user != false){
        
        // request.body es un objeto
        let query = '';
        let okay = false;


        if(Object.keys(request.body)[0] == 'comida'){

            try{
                // El usuario nos paso una comida
                query = "call addPedidoComida(?,?,?)";
                let params = [user,request.body.comida,request.body.cantidad];
                let [results] = await request.database.query(mysql.format(query,params));

                if(results.affectedRows == 1){
                    okay = true;
                }
            }
            catch(error){
                console.log(error);
            }
            
        }
        else{
            // El usuario nos paso una bebida

            try{
                let bebida = request.body.bebida;
                let tamaño = request.body.tamaño;
                let cantidad = request.body.cantidad;
        
                query = "call addPedidoBebida(?,?,?,?)";
                let params = [user,bebida,tamaño,cantidad];
        
                let [results] = await request.database.query(mysql.format(query,params));

                if(results.affectedRows == 1){
                    okay = true;
                }
            }
            catch(error){
                console.log(error);
            }  
        }

        if(okay){
            console.log('insercion a la base de datos exitosa');
            response.status(200).send({redirect:'/carrito'});
        }

    }
    else{
        response.status(200).send({logueado:false});
    }
   
}



async function crearCuenta(request,response){

    let name = request.body.name;
    let lastname = request.body.lastname;
    let email = request.body.email;
    let number = request.body.numer;
    let password = request.body.password;
    let confirmation = request.body.confirmation;

    if(!name || !lastname || !email || !number || password || !confirmation){
        response.status(200).send({message:'Debes de ingresar todos los datos'});
    }
    else{

    }
}

export const methods = {
    addPedido_producto,
    crearCuenta
}