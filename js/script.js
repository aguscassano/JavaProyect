
let ingresosMensuales = 0;
let gastos = [];

const ingresoForm = document.getElementById("ingresoForm");
const gastosForm = document.getElementById("gastosForm");
const ingresoInput = document.getElementById("ingreso");
const descripcionInput = document.getElementById("descripcion");
const montoInput = document.getElementById("monto");
const ingresosTotales = document.getElementById("ingresosTotales");
const saldoElement = document.getElementById("saldo");
const listaGastos = document.getElementById("listaGastos");


const actualizarSaldo = () => {
    const totalGastos = gastos.reduce((suma, gasto) => suma + gasto.monto, 0);
    const saldo = ingresosMensuales - totalGastos;

    saldoElement.textContent = saldo.toFixed(2);
    saldoElement.className = saldo >= 0 ? "saldo" : "saldo negativo";
};


const agregarGastoDOM = (descripcion, monto) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
        <td>${descripcion}</td>
        <td>$${monto.toFixed(2)}</td>
    `;
    listaGastos.appendChild(fila);
};


ingresoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    ingresosMensuales = parseFloat(ingresoInput.value);

    if (isNaN(ingresosMensuales) || ingresosMensuales <= 0) {
        alert("Por favor ingresa un monto válido para los ingresos.");
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
        alert("Por favor ingresa una descripción válida y un monto válido para el gasto.");
        return;
    }

    
    gastos.push({ descripcion, monto });

    localStorage.setItem("gastos", JSON.stringify(gastos));


    agregarGastoDOM(descripcion, monto);

    actualizarSaldo();

    descripcionInput.value = "";
    montoInput.value = "";
});

window.addEventListener("load", () => {
    const gastosGuardados = localStorage.getItem("gastos");
    if (gastosGuardados) {
        gastos = JSON.parse(gastosGuardados);
        gastos.forEach(({ descripcion, monto }) => {
            agregarGastoDOM(descripcion, monto);
        });
    }

    const ingresosGuardados = localStorage.getItem("ingresosMensuales");
    if (ingresosGuardados) {
        ingresosMensuales = parseFloat(ingresosGuardados);
        ingresosTotales.textContent = ingresosMensuales.toFixed(2);
        gastosForm.style.display = "block";
        ingresoForm.style.display = "none";
    }

    actualizarSaldo();
});


const resetButton = document.getElementById("resetButton");

resetButton.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que deseas restablecer todos los valores?")) {
        
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

        alert("Valores restablecidos con éxito.");
    }
});

