class Carrito{

    constructor(){
        this.comidas = [];
        this.bebidas = [];
    }

    agregarComida(comida){
        this.comidas.push(comida);
    }

    agregarBebida(bebida){
        this.bebidas.push(bebida);
    }

    obtenerComidas(){
        return this.comidas
    }

    obtenerBebidas(){
        return this.bebidas
    }

    vaciarCarrito(){
        this.comidas = [];
        this.bebidas = [];
    }

}

export default Carrito;