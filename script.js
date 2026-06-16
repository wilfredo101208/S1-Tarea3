const dataInput = document.getElementById("dataInput");
const botonAnalizar = document.getElementById("analizarBtn");
const resultados = document.getElementById("resultados");

botonAnalizar.addEventListener("click", mostrarResultados);

function mostrarResultados() {
  if (dataInput.value.trim() === "") {
    alert("Por favor, ingresa un conjunto de datos válido.");
    return;
  }
  if (!dataInput.value.includes(",")) {
    alert("Por favor, ingresa los datos separados por comas.");
    return;
  }

  const datos = dataInput.value
    .split(",")
    .filter((v) => v.trim() !== "")
    .map(Number);

  if (datos.some(isNaN)) {
    alert("Por favor, asegúrate de que todos los datos sean números.");
    return;
  }
  if (datos.length < 2) {
    alert("Por favor, ingresa al menos dos datos.");
    return;
  }

  const analisis = analizarDatos(datos);

  dataInput.value = datos.join(", ");
  resultados.innerHTML = `
    <p>Datos ordenados: ${analisis.datosOrdenados.join(", ")}</p>
    <p>Tamaño del conjunto de datos: ${analisis.n}</p>
    <p>Media: ${analisis.media.toFixed(2)}</p>
    <p>Mediana: ${analisis.mediana.toFixed(2)}</p>
    <p>Moda(s): ${analisis.modas.join(", ")}</p>
    <p>Valor máximo: ${analisis.max}</p>
    <p>Valor mínimo: ${analisis.min}</p>
    <p>Rango: ${analisis.rango}</p>
    <p>Varianza: ${analisis.varianza.toFixed(4)}</p>
    <p>Desviación estándar: ${analisis.desviacionEstandar.toFixed(4)}</p>
  `;
}

function analizarDatos(numeros) {
  const ordenados = [...numeros].sort((a, b) => a - b);
  const media = calcularMedia(numeros);
  const mediana = calcularMediana(ordenados);
  const modas = calcularModas(numeros);
  const n = numeros.length;
  const max = Math.max(...numeros);
  const min = Math.min(...numeros);
  const rango = max - min;
  const varianza = calcularVarianza(numeros, n, media);
  const desviacionEstandar = Math.sqrt(varianza);

  return {
    datosOrdenados: ordenados,
    n: n,
    media: media,
    mediana: mediana,
    modas: modas,
    max: max,
    min: min,
    rango: rango,
    varianza: varianza,
    desviacionEstandar: desviacionEstandar,
  };
}

function calcularMedia(numeros) {
  const suma = numeros.reduce((a, b) => a + b, 0);
  const media = suma / numeros.length;
  return media;
}

function calcularMediana(numerosOrdenados) {
  const n = numerosOrdenados.length;

  if (n % 2 !== 0) {
    return numerosOrdenados[(n - 1) / 2];
  } else {
    return (numerosOrdenados[n / 2 - 1] + numerosOrdenados[n / 2]) / 2;
  }
}

function calcularModas(numeros) {
  const frecuencias = {};

  for (let num of numeros) {
    if (frecuencias[num]) {
      frecuencias[num]++;
    } else {
      frecuencias[num] = 1;
    }
  }

  let maxFrecuencia = 0;
  let modas = [];

  for (let num in frecuencias) {
    if (frecuencias[num] > maxFrecuencia) {
      maxFrecuencia = frecuencias[num];
    }
  }

  for (let num in frecuencias) {
    if (frecuencias[num] === maxFrecuencia) {
      modas.push(Number(num));
    }
  }

  if (modas.length === Object.keys(frecuencias).length) {
    return ["No hay moda"];
  }
  return modas;
}

function calcularVarianza(numeros, n, media) {
  const cuadrados = numeros.map((x) => Math.pow(x - media, 2));
  const suma = cuadrados.reduce((a, b) => a + b, 0);
  const varianza = suma / n;
  return varianza;
}
