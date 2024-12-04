import mysql from "mysql2";
import { methods as funciones} from "./retornos.js";
import { carritoTemporal } from "./inserciones.js";



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
        // Si el usuario quiere eliminar sin estar logueado, eliminaremos del arreglo temporal

        if(Object.keys(request.body)[0] == 'bebida'){
            // El producto a eliminar es de tipo bebida

            let bebidas = carritoTemporal.obtenerBebidas();


            // debemos encontrar la bebida en especifico
            let index = bebidas.findIndex(bebida=>
                bebida.nombre_bebida == request.body.bebida && bebida.tamaño == request.body.tamaño
            );

            // Cuando nos devuelve -1 es porque no encontro una coincidencia, por lo que no puede eliminar
            if(index!=-1){
                bebidas.splice(index, 1);
                console.log('bebida borrada del carrito temporal');
            }

            console.log(carritoTemporal.obtenerBebidas());


        }
        else{
            // El producto a eliminar es de tipo comida

            let comidas = carritoTemporal.obtenerComidas();


            let index = comidas.findIndex(comida=>
                comida.nombre_comida == request.body.comida
            );

            // Si nos devuelve -1 es porque no encontro ninguna coincidencia
            if(index!=-1){
                comidas.splice(index, 1);
                console.log('comida eliminada del carrito temporal');
            }

            console.log(carritoTemporal.obtenerComidas());


        }


        // No importa cual de los dos se halla eliminado, debemos de arrojar el nuevo total

        let nuevo_arreglo_comidas = carritoTemporal.obtenerComidas();
        let nuevo_arreglo_bebidas = carritoTemporal.obtenerBebidas();

        let total = 0;

        for(let comida in nuevo_arreglo_comidas){
            total +=  nuevo_arreglo_comidas[comida].subtotal;
        }

        for(let bebida in nuevo_arreglo_bebidas){
            total+= nuevo_arreglo_bebidas[bebida].subtotal;
        }

        console.log(total);


        response.status(200).send({total:total});
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

        try{

            // No debemos eliminar el pedido si hay productos pendientes
            let cantidad_comidas = carritoTemporal.obtenerComidas().length;
            let cantidad_bebidas = carritoTemporal.obtenerBebidas().length;
            let cantidad = cantidad_bebidas + cantidad_comidas;
            let eliminacion = 0; // Si esta en 0 significa que no eliminamos el pedido

            if(cantidad>0){
                // Ahora si podemos eliminar el pedido
                carritoTemporal.vaciarCarrito();
                eliminacion = 1;
            }

            return response.status(200).send({eliminacion:eliminacion});

        }catch(error){
            console.log(`Al parecer hubo un error ${error}`);
            return response.status(500).send({eliminacion:0});
        }
    }


}

export const methods = {
    eliminarPedidoProducto,
    eliminarPedido
}



