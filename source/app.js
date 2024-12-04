import express, { request, response } from 'express';
import path from 'path';
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
import connection from '../database/connection.js';
import { methods as retornar } from '../controllers/retornos.js';
import { methods as comprobacion } from '../middlewares/comprobacion.js';
import { methods as inserciones, carritoTemporal } from '../controllers/inserciones.js';
import { methods as eliminaciones } from '../controllers/eliminaciones.js';
import { methods as procedimientos } from '../controllers/procedimientos.js';


const _dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Si queremos que todo lo que esta en la carpeta public lo cargue como archivo estatico
app.use(express.static(path.join(_dirname,'../public')));

app.use(express.json());
app.use(cookieParser());

app.use((request, response, next) => {
    request.database = connection;
    next();
});


const port = 3000;



// GET
app.get('/inicio',(request,response)=>{
    response.sendFile(path.join(_dirname,"../public/pages/inicio.html"));
});

app.get('/menu', (request,response)=>{
    response.sendFile(path.join(_dirname,  "../public/pages/menu.html"));
});

app.get('/locales', (request,response)=>{
    response.sendFile(path.join(_dirname,"../public/pages/locales.html"));
});


app.get('/producto', (request,response)=>{
    response.sendFile(path.join(_dirname,"../public/pages/producto.html"));
});

app.get('/carrito' ,(request,response)=>{
    response.sendFile(path.join(_dirname,"../public/pages/carrito.html"));
});


app.get('/procederPago',comprobacion.carrito, (request, response)=>{
    // Si no existe un carrito, no podemos seguir adelante
    response.sendFile(path.join(_dirname,"../public/pages/procederPago.html"));
});


app.get('/nosotros',(request,response)=>{
    response.sendFile(path.join(_dirname,"../public/pages/nosotros.html"));
});


app.get('/login',(request,response)=>{
    response.sendFile(path.join(_dirname,"../public/pages/login.html"));
});

app.get('/crear_cuenta',(request,response)=>{
    response.sendFile(path.join(_dirname,"../public/pages/crear.html"))
})



// POST
app.post('/menu', retornar.comidas);
app.post('/locales',retornar.locales);
app.post('/producto',retornar.producto);
app.post('/addPedido',inserciones.addPedido_producto);
app.post('/pedirPedido',retornar.pedido);
app.post('/eliminarPedidoProducto',eliminaciones.eliminarPedidoProducto);
app.post('/eliminarTodoPedido', eliminaciones.eliminarPedido);
app.post('/carrito_tarjetas', retornar.cards_and_cart);
app.post('/finalizarPedido', procedimientos.finalizarPedido);
app.post('/loginInsert',retornar.Login);
app.post('/inicioPOST', retornar.mensaje);
app.post('/nosotrosLogin', retornar.mensaje);
app.post('/account',inserciones.crearCuenta);


app.listen(port,()=>{
    console.log(`Servidor corriendo en el puerto ${port}`);
});


//ItsukiSoto23#