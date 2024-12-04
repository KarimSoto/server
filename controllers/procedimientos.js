import mysql from "mysql2";
import { methods as funciones } from "./retornos.js";

async function finalizarPedido(request,response){

    let user = await funciones.logueado(request);
    
    if(user != false){

        let card = request.body.card;

        let query = "select no_tarjeta from tarjetas where correo_cliente = ?";
        let params = [user];
    
        let [results] = await request.database.query(mysql.format(query,params));
    
        let numeros = [];
    
        let finalizacion = 0;
    
        for(let indice in results){
            
            numeros.push(results[indice].no_tarjeta);
        }
    
        let noTarjeta = numeros.find((numero)=>numero.slice(numero.length-4,numero.length) == card);
    
        if(noTarjeta != undefined){
            
            let q = "call finalizarPedido(?,?)";
            let p = [user,noTarjeta];
    
            let [results2] = await request.database.query(mysql.format(q,p));
    
            finalizacion = Object.values(results2[0][0])[0];
        }
    
    
        response.status(200).send({finalizacion:finalizacion});
    }
    else{
        console.log('El usuario no esta logueado');
    }
    
}


export const methods = {
    finalizarPedido
}