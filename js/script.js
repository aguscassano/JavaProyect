
let ingresosMensuales = 0;
let gastos = [];

// DOM
const ingresoForm = document.getElementById("ingresoForm");
const gastosForm = document.getElementById("gastosForm");
const ingresoInput = document.getElementById("ingreso");
const descripcionInput = document.getElementById("descripcion");
const montoInput = document.getElementById("monto");
const ingresosTotales = document.getElementById("ingresosTotales");
const saldoElement = document.getElementById("saldo");
const listaGastos = document.getElementById("listaGastos");
const resetDatos = document.getElementById("resetDatos");
const convertirMonedaBtn = document.getElementById("convertirMoneda");
const monedaSelect = document.getElementById("moneda");
const saldoConvertidoElement = document.getElementById("saldoConvertido");
const monedaSeleccionadaElement = document.getElementById("monedaSeleccionada");


const API_KEY = "127938715da888c75abfaaf2da2469ac";
const API_URL = `https://api.currencylayer.com/live?access_key=127938715da888c75abfaaf2da2469ac&currencies=USD,EUR,BRL&source=ARS&format=1`;

//tasas de cambio
const obtenerTasaDeCambio = async (monedaDestino) => {
    try {
        const respuesta = await fetch(API_URL);
        const datos = await respuesta.json();
        return datos.quotes[`ARS${monedaDestino}`] || null;
    } catch (error) {
        console.error("Error al obtener tasa de cambio:", error);
        return null;
    }
};

// Actualizar saldo
const actualizarSaldo = () => {
    const totalGastos = gastos.reduce((suma, gasto) => suma + gasto.monto, 0);
    const saldo = ingresosMensuales - totalGastos;
    saldoElement.textContent = saldo.toFixed(2);
    saldoElement.className = saldo >= 0 ? "saldo" : "saldo negativo";
};

// Agregar gasto al DOM
const agregarGastoDOM = ({ descripcion, monto }) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td>${descripcion}</td><td>$${monto.toFixed(2)}</td>`;
    listaGastos.appendChild(fila);
};

ingresoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    ingresosMensuales = parseFloat(ingresoInput.value);
    
    if (isNaN(ingresosMensuales) || ingresosMensuales <= 0) {
        Swal.fire("Error", "Ingresa un monto válido", "error");
        return;
    }

    ingresosTotales.textContent = ingresosMensuales.toFixed(2);
    gastosForm.style.display = "block";
    ingresoForm.style.display = "none";
    localStorage.setItem("ingresosMensuales", ingresosMensuales);
    actualizarSaldo();
});

gastosForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const descripcion = descripcionInput.value.trim();
    const monto = parseFloat(montoInput.value);

    if (!descripcion || isNaN(monto) || monto <= 0) {
        Swal.fire("Error", "Ingresa una descripción y monto válido", "error");
        return;
    }

    const nuevoGasto = { descripcion, monto };
    gastos.push(nuevoGasto);
    localStorage.setItem("gastos", JSON.stringify(gastos));

    agregarGastoDOM(nuevoGasto);
    actualizarSaldo();
});

convertirMonedaBtn.addEventListener("click", async () => {
    const monedaDestino = monedaSelect.value;
    const tasa = await obtenerTasaDeCambio(monedaDestino);
    if (tasa) {
        const saldoConvertido = (parseFloat(saldoElement.textContent) * tasa).toFixed(2);
        saldoConvertidoElement.textContent = saldoConvertido;
        monedaSeleccionadaElement.textContent = monedaDestino;
    } else {
        Swal.fire("Error", "No se pudo obtener la tasa de cambio", "error");
    }
});

//restablecer 
document.getElementById("resetDatos").addEventListener("click", () => {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esto eliminará todos los datos almacenados.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, borrar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#dc3545",
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("ingresosMensuales");
            localStorage.removeItem("gastos");

            ingresosMensuales = 0;
            gastos = [];
            ingresosTotales.textContent = "0.00";
            saldoElement.textContent = "0.00";
            saldoElement.className = "saldo";
            listaGastos.innerHTML = "";
            ingresoForm.style.display = "block";
            gastosForm.style.display = "none";
            ingresoInput.value = "";

            Swal.fire("Datos borrados", "Tu información ha sido eliminada.", "success");
        }
    });
});

