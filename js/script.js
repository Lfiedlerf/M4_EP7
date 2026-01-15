/* M4_EP_RickAndMorty: Consumo de API y Optimización */

// VARIABLE GLOBAL DE OPTIMIZACIÓN (Caché)
// Aquí se almacenan los datos para no reiterar la llamada a la API.
let datosLocales = null;

// URL del Endpoint (IDs del 1 al 10)
const API_URL = "https://rickandmortyapi.com/api/character/1,2,3,4,5,6,7,8,9,10";

// --- FUNCIÓN CORE: OBTENER DATOS (FETCH) ---
async function obtenerDatos() {
    const status = document.getElementById("status-msg");

    // 1. Verificamos si ya tenemos los datos en memoria (Optimización)
    if (datosLocales !== null) {
        status.innerText = "Datos cargados desde memoria local (Sin petición HTTP).";
        console.log("LOG: Usando caché local.");
        return datosLocales;
    }

    // 2. Si no están, hacemos el Fetch a la API
    try {
        status.innerText = "⏳ Consultando API externa...";
        console.log("LOG: Haciendo petición FETCH a la API...");
        
        const respuesta = await fetch(API_URL);
        
        if (!respuesta.ok) throw new Error("Error en la petición");
        
        const data = await respuesta.json();
        
        // 3. Guardamos en la variable global para el futuro
        datosLocales = data;
        
        status.innerText = "Datos descargados y guardados en memoria.";
        return data;

    } catch (error) {
        console.error("Error:", error);
        status.innerText = "Error al conectar con la API.";
        return null;
    }
}

// --- CASO 1: MOSTRAR LISTA COMPLETA ---
async function mostrarTodos() {
    const personajes = await obtenerDatos();
    if (!personajes) return;

    const contenedor = document.getElementById("resultados");
    contenedor.innerHTML = ""; // Limpiar vista

    // Renderizamos las tarjetas
    personajes.forEach(pj => {
        contenedor.innerHTML += `
            <div class="character-card">
                <img src="${pj.image}" alt="${pj.name}">
                <div class="card-info">
                    <h3>${pj.name}</h3>
                    <p><strong>ID:</strong> ${pj.id}</p>
                    <p><strong>Especie:</strong> ${pj.species}</p>
                </div>
            </div>
        `;
    });
}

// --- CASO 2: AGRUPAR POR ESPECIE ---
async function filtrarPorEspecie() {
    const personajes = await obtenerDatos();
    if (!personajes) return;

    const contenedor = document.getElementById("resultados");
    contenedor.innerHTML = "";

    // Lógica de agrupación (reduce)
    const grupos = personajes.reduce((acc, pj) => {
        const especie = pj.species;
        if (!acc[especie]) {
            acc[especie] = [];
        }
        acc[especie].push(pj);
        return acc;
    }, {});

    // Renderizamos los grupos
    for (const especie in grupos) {
        let listaHTML = `
            <div class="species-group full-width">
                <h2>${especie}</h2>
                <ul>
        `;
        
        grupos[especie].forEach(pj => {
            listaHTML += `<li>${pj.name} (ID: ${pj.id})</li>`;
        });

        listaHTML += `</ul></div>`;
        contenedor.innerHTML += listaHTML;
    }
}

// --- CASO 3: MOSTRAR FICHA INDIVIDUAL ---
async function mostrarFicha(idBusqueda) {
    const personajes = await obtenerDatos();
    if (!personajes) return;

    // Buscamos el personaje específico en nuestra memoria local
    // (No llamamos a la API de nuevo para buscar uno solo, usamos lo que ya tenemos)
    const pj = personajes.find(p => p.id === idBusqueda);

    const contenedor = document.getElementById("resultados");
    contenedor.innerHTML = ""; // Limpiar vista

    if (pj) {
        contenedor.innerHTML = `
            <div class="character-card" style="max-width: 400px; margin: 0 auto;">
                <img src="${pj.image}" alt="${pj.name}">
                <div class="card-info">
                    <h2>${pj.name}</h2>
                    <hr>
                    <p><strong>ID:</strong> ${pj.id}</p>
                    <p><strong>Especie:</strong> ${pj.species}</p>
                    <p><strong>Estado:</strong> ${pj.status}</p>
                    <p><strong>Origen:</strong> ${pj.origin.name}</p>
                </div>
            </div>
        `;
    } else {
        contenedor.innerHTML = "<p>Personaje no encontrado.</p>";
    }
}