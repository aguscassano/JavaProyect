let ingresosMensuales = 0;

let gastos = [];

const categoriasGastos = ["Alquier", "Comida", "Transporte", "Servicios", "Otros"];

const obtenerIngresos = () => {
    let ingresos = parseFloat (prompt("Por favor ingrese su ingreso mensual: "));
    while (isNaN(ingresos)|| ingresos<= 0){
        ingresos = parseFloat (prompt("Ingrese un numero de ingresos valido!"));
    }
    return ingresos;
};

const registrarGastos = () => {
    let continuar = true;
    let listaGastos = [];

    while (continuar){
        let descripcion = prompt ("Ingrese una descripcion para el gasto (Ejemplo: Alquiler)");
        let monto = parseFloat (prompt (`¿Cuanto gastaste en ${descripcion}?`));

        while (isNaN(monto)|| monto <= 0){
            monto = parseFloat (prompt ("Monto invalido, por favor ingrese un valor numerico"));
        }

        listaGastos.push ({ descripcion, monto});
        continuar = confirm ("¿Quieres ingresar otro gasto?");
    }

    return listaGastos;
};


const calcularSaldo = (ingresos, gastos) => {
    let totalGastos = gastos.reduce ((suma, gasto) => suma + gasto.monto, 0);
    let saldo = ingresos - totalGastos;

    if (saldo < 0){
        alert (`Has gastado mas de lo que ganas. Tu saldo es negativo: $${saldo.toFixed(2)}`);
    }else {
        alert(`Tu saldo restante es: $${saldo.toFixed(2)}`);
    }
};


document.getElementById("iniciarSimulador").addEventListener("click", () => {
    ingresosMensuales = obtenerIngresos();
    gastos = registrarGastos();
    calcularSaldo(ingresosMensuales, gastos);
});
