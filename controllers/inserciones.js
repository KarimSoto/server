import mysql from "mysql2";
import { methods as funciones } from "./retornos.js";
import Carrito from "./Carrito.js";


const carritoTemporal = new Carrito();


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
        // Si el usuario esta logueado, vamos a almacenar el producto de forma temporal

        if(Object.keys(request.body)[0] == 'comida'){

            let queryBusCo = "call getComidasValores(?)";
            let paramBusCo = [request.body.comida];

            let [resBusCo] = await request.database.query(mysql.format(queryBusCo,paramBusCo));

            console.log(resBusCo[0][0]);

            let comida = {
                nombre_comida:request.body.comida,
                precio:resBusCo[0][0].precio,
                img:resBusCo[0][0].img,
                cantidad:request.body.cantidad,
                subtotal:resBusCo[0][0].precio*request.body.cantidad
            }
            
            carritoTemporal.agregarComida(comida);
        }
        else{

            let queryBusBe = "call getBebidaValores(?,?)";
            let paramBusBe = [request.body.bebida, request.body.tamaño];

            let [resBusBe] = await request.database.query(mysql.format(queryBusBe,paramBusBe));

            console.log(resBusBe[0][0]);

            let bebida = {
                nombre_bebida:request.body.bebida,
                precio:resBusBe[0][0].precio,
                img:resBusBe[0][0].img,
                tamaño:request.body.tamaño,
                cantidad:request.body.cantidad,
                subtotal:resBusBe[0][0].precio*request.body.cantidad
            }

            carritoTemporal.agregarBebida(bebida);
        }

        console.log('producto temporalmente almacenado');

        response.status(200).send({redirect:'/carrito'});

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
};


export { carritoTemporal };

