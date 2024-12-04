import mysql from "mysql2";

async function carrito(request,response,next){

    let user = "karimtec2003@gmail.com";
    let query = "call showCart(?,'pendiente')";
    let params = [user];

    let [results] = await request.database.query(mysql.format(query,params));

    
    if(results[0].length == 0){
        // significa que no hay un pedido pendiente del usuario
        let previousPage = request.get('Referer') || '/menu';
        return response.redirect(previousPage);
    }
    else{
        next();
    }
}


export const methods = {
    carrito
}