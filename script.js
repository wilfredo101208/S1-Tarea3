// Referencias a los elementos de la interfaz
const dataInput = document.getElementById("dataInput");
const botonAnalizar = document.getElementById("analizarBtn");
const resultados = document.getElementById("resultados");

// Ejecuta el análisis cuando el usuario de click en el botón
botonAnalizar.addEventListener("click", mostrarResultados);

function mostrarResultados() {
  // Verifica que el campo no esté vacío.
  if (dataInput.value.trim() === "") {
    alert("Por favor, ingresa un conjunto de datos válido.");
    return;
  }
  // Verifica que los datos estén separados por comas.
  if (!dataInput.value.includes(",")) {
    alert("Por favor, ingresa los datos separados por comas.");
    return;
  }

  // Guarda los datos de la cadena de texto en un arreglo de números, filtrando valores vacíos
  const datos = dataInput.value
    .split(",")
    .filter((v) => v.trim() !== "")
    .map(Number);

  // Valida que el arreglo datos solo contenga números
  if (datos.some(isNaN)) {
    alert("Por favor, asegúrate de que todos los datos sean números.");
    return;
  }
  // Valida que el arreglo contenga al menos dos datos, con un solo dato el análisis sería irrelevante
  if (datos.length < 2) {
    alert("Por favor, ingresa al menos dos datos.");
    return;
  }

  /*
  Hechas las validaciones, se reescriben los datos limpios en el input
  Esto elimina espacios innecesarios alrededor de los números, comas consecutivas, y permite al usuario aún editar los datos
  */
  dataInput.value = datos.join(", ");

  // Calcula las medidas estadísticas del conjunto de datos
  const analisis = analizarDatos(datos);

  resultados.innerHTML = `
    <p>Datos ordenados: ${analisis.datosOrdenados.join(", ")}</p>
    <p>Tamaño del conjunto de datos: ${analisis.n}</p>
    <p>Media: ${analisis.media.toFixed(2)}</p>
    <p>Mediana: ${analisis.mediana.toFixed(2)}</p>
    <p>Moda(s): ${analisis.modas.join(", ")}</p>
    <p>Valor máximo: ${analisis.max}</p>
    <p>Valor mínimo: ${analisis.min}</p>
    <p>Rango: ${analisis.rango}</p>
    <p>Varianza (muestral): ${analisis.varianza.toFixed(4)}</p>
    <p>Desviación estándar (muestral): ${analisis.desviacionEstandar.toFixed(4)}</p>
  `;
}

function analizarDatos(numeros) {
  // Crea un nuevo arreglo con los datos ordenados, sin afectar el conjunto original
  const ordenados = [...numeros].sort((a, b) => a - b);

  // Calcula las medidas de tendencia central
  const media = calcularMedia(numeros);
  const mediana = calcularMediana(ordenados);
  const modas = calcularModas(numeros);

  // Calcula otros estadísticos relevantes
  const n = numeros.length;
  const max = Math.max(...numeros);
  const min = Math.min(...numeros);
  const rango = max - min;
  const varianza = calcularVarianza(numeros, n, media);

  // La desviación estándar es la raíz cuadrada de la varianza
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
  // La media aritmética (o promedio) es la suma de los datos dividida entre la cantidad de datos
  const suma = numeros.reduce((a, b) => a + b, 0);
  const media = suma / numeros.length;
  return media;
}

function calcularMediana(numerosOrdenados) {
  // La mediana es el dato central o la media de los dos datos centrales cuando los datos están ordenados ascendentemente
  const n = numerosOrdenados.length;

  /*
  Si la cantidad de números es impar, la mediana es el valor que está en el centro
  Si la cantidad es par, la mediana es el promedio de los dos valores centrales
  Las posiciones se calculan teniendo en cuenta que están indexadas desde 0
  */
  if (n % 2 !== 0) {
    return numerosOrdenados[(n - 1) / 2]; 
  } else {
    return (numerosOrdenados[n / 2 - 1] + numerosOrdenados[n / 2]) / 2;
  }
}

function calcularModas(numeros) {
  // Los valores modales son aquellos que tienen la frecuencia máxima en el conjunto
  
  const frecuencias = {}; // Objeto que almacene cuántas veces aparece cada valor
  for (let num of numeros) {
    if (frecuencias[num]) {
      frecuencias[num]++;
    } else {
      frecuencias[num] = 1;
    }
  }
  
  let maxFrecuencia = 0;
  let modas = [];

  // Busca la frecuecnia máxima observada
  for (let num in frecuencias) {
    if (frecuencias[num] > maxFrecuencia) {
      maxFrecuencia = frecuencias[num];
    }
  }

  // Recupera todos los valores que tienen la frecuencia máxima.
  for (let num in frecuencias) {
    if (frecuencias[num] === maxFrecuencia) {
      modas.push(Number(num));
    }
  }
  
  // Si todos los valores tienen la misma frecuencia, estadísticamente se considera que no existe moda.
  if (modas.length === Object.keys(frecuencias).length) {
    return ["No hay moda"];
  }
  return modas;
}

function calcularVarianza(numeros, n, media) {
  // La varianza mide qué tan dispersos están los datos respecto a la media, en unidades cuadradas
  // Calcula el cuadrado de la distancia de cada dato respecto a la media
  const cuadrados = numeros.map((x) => Math.pow(x - media, 2));
  
  const suma = cuadrados.reduce((a, b) => a + b, 0);
  const varianza = suma / (n - 1); //Calcula la varianza asumiendo que el conjunto de datos corresponde a una muestra
  
  return varianza;
}
