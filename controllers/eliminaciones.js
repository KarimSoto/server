import mysql from "mysql2";
import { methods as funciones} from "./retornos.js";



async function eliminarPedidoProducto(request,response){

    let query ='';
    let params = [];
    let user = await funciones.logueado(request);

    if(user != false){
        var total = 0;

        // Es de tipo bebida el que vamos a eliminar
        if(Object.keys(request.body)[0] == 'bebida'){
    
            try{
                let i_bebida = request.body.bebida;
                let i_tamaño = request.body.tamaño;
                
    
                query="select deletePedidoBebida(?,?,?)";
                params = [i_bebida,i_tamaño,user];
    
                let [results] = await request.database.query(mysql.format(query,params));
            
                // veirifcar antes de hacer una asignacion
                if(results!= null && results.length > 0){
                    console.log(Object.values(results[0])[0]);
                    total = Object.values(results[0])[0];
                    response.status(200).send({total:total});
                }
                
            }
            catch(error){
                console.log(error);
            }
        }
        else{
            // Es de tipo comida el que vamos a eliminar
            if(Object.keys(request.body)[0] == 'comida'){
    
                try{
                    let i_comida = request.body.comida;
            
                    query="select deletePedidoComida(?,?)";
                    params = [i_comida,user];
            
                    let [results] = await request.database.query(mysql.format(query,params));
                
                    if(results!= null && results.length > 0){
                        console.log(Object.values(results[0])[0]);
                        total = Object.values(results[0])[0];
                        response.status(200).send({total:total});
                    }
                    
                    
                }
                catch(error){
                    console.log(error);
                }
                
            }
            else{
                // No es de tipo comida ni bebida
                response.status(200).send({total:"error"});
            }
        }
    }
    else{
        console.log('El usuario no esta logueado')
    }
    

}



async function eliminarPedido(request,response){

    
    let user = await funciones.logueado(request);

    if(user != false){
        let eliminacion = 0;            // No se elimino

        try{
            let query = "call deleteAllOrder(?)";
            let params = [user];
            let [results] = await request.database.query(mysql.format(query,params));

            if(results!= null && results.length > 0){
                eliminacion = Object.values(results[0])[0];
            }
        }
        catch(error){
            console.log(error);

            // Con return obligamos a que finalize la funcion
            return response.status(400).send({eliminacion:eliminacion});
        }

        return response.status(200).send({eliminacion:eliminacion});
    }
    else{
        console.log('El usuario no esta logueado');
    }


}

export const methods = {
    eliminarPedidoProducto,
    eliminarPedido
}



