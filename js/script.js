// Variables y Arrays
let ingresosMensuales = 0;
let gastos = [];

// Elementos del DOM
const ingresoForm = document.getElementById("ingresoForm");
const gastosForm = document.getElementById("gastosForm");
const ingresoInput = document.getElementById("ingreso");
const descripcionInput = document.getElementById("descripcion");
const montoInput = document.getElementById("monto");
const ingresosTotales = document.getElementById("ingresosTotales");
const saldoElement = document.getElementById("saldo");
const listaGastos = document.getElementById("listaGastos");

// Función para mostrar saldo actualizado
const actualizarSaldo = () => {
    const totalGastos = gastos.reduce((suma, gasto) => suma + gasto.monto, 0);
    const saldo = ingresosMensuales - totalGastos;

    saldoElement.textContent = saldo.toFixed(2);
    saldoElement.className = saldo >= 0 ? "saldo" : "saldo negativo";
};

// Función para agregar un gasto al DOM
const agregarGastoDOM = (descripcion, monto) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
        <td>${descripcion}</td>
        <td>$${monto.toFixed(2)}</td>
    `;
    listaGastos.appendChild(fila);
};

// Mostrar el formulario de gastos y ocultar el de ingresos al establecer ingresos
ingresoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    ingresosMensuales = parseFloat(ingresoInput.value);

    if (isNaN(ingresosMensuales) || ingresosMensuales <= 0) {
        alert("Por favor ingresa un monto válido para los ingresos.");
        return;
    }

    ingresosTotales.textContent = ingresosMensuales.toFixed(2);

    // Mostrar formulario de gastos
    gastosForm.style.display = "block";

    // Ocultar formulario de ingresos
    ingresoForm.style.display = "none";

    // Guardar los ingresos en LocalStorage
    localStorage.setItem("ingresosMensuales", ingresosMensuales);

    actualizarSaldo();
});

// Evento para registrar un nuevo gasto
gastosForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const descripcion = descripcionInput.value.trim();
    const monto = parseFloat(montoInput.value);

    if (!descripcion || isNaN(monto) || monto <= 0) {
        alert("Por favor ingresa una descripción válida y un monto válido para el gasto.");
        return;
    }

    // Guardar el gasto en el array
    gastos.push({ descripcion, monto });

    // Guardar los gastos en el LocalStorage
    localStorage.setItem("gastos", JSON.stringify(gastos));

    // Mostrar el gasto en la tabla
    agregarGastoDOM(descripcion, monto);

    // Actualizar el saldo
    actualizarSaldo();

    // Limpiar los inputs
    descripcionInput.value = "";
    montoInput.value = "";
});

// Recuperar datos del LocalStorage al cargar la página
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

// Botón de restablecer valores
const resetButton = document.getElementById("resetButton");

resetButton.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que deseas restablecer todos los valores?")) {
        // Eliminar datos del LocalStorage
        localStorage.removeItem("ingresosMensuales");
        localStorage.removeItem("gastos");

        // Reiniciar las variables
        ingresosMensuales = 0;
        gastos = [];

        // Restablecer los valores en el DOM
        ingresosTotales.textContent = "0.00";
        saldoElement.textContent = "0.00";
        saldoElement.className = "saldo";
        listaGastos.innerHTML = "";

        // Mostrar el formulario de ingresos y ocultar el de gastos
        ingresoForm.style.display = "block";
        gastosForm.style.display = "none";

        alert("Valores restablecidos con éxito.");
    }
});

