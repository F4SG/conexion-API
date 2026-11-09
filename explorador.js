const endpoints = {
    citas: "https://dummyjson.com/quotes/random",
    perros: "https://dog.ceo/api/breeds/image/random",
    gatos: "https://cataas.com/cat?json=true",
    datos: "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en"
};

async function solicitarJSON(url, signal) {
    const respuesta = await fetch(url, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal
    });

    if (!respuesta.ok) {
        throw new Error(`La API respondió con HTTP ${respuesta.status}`);
    }

    return await respuesta.json();
}

function leerTexto(valor, campo) {
    if (typeof valor !== "string" || !valor.trim()) {
        throw new Error(`Falta el campo ${campo} en la respuesta`);
    }
    return valor.trim();
}

async function cargarCita(contenido, signal) {
    const datos = await solicitarJSON(endpoints.citas, signal);
    const cita = leerTexto(datos.quote, "quote");
    const autor = leerTexto(datos.author, "author");

    contenido.querySelector("[data-cita]").textContent = cita;
    contenido.querySelector("[data-autor]").textContent = autor;
}

async function cargarPerro(contenido, signal) {
    const datos = await solicitarJSON(endpoints.perros, signal);
    const url = leerTexto(datos.message, "message");
    await mostrarImagen(contenido, url, "Fotografía de un perro", signal);
}

async function cargarGato(contenido, signal) {
    const datos = await solicitarJSON(endpoints.gatos, signal);
    const url = datos.url
        ? new URL(datos.url, endpoints.gatos).href
        : new URL(`/cat/${encodeURIComponent(leerTexto(datos.id, "id"))}`, endpoints.gatos).href;

    await mostrarImagen(contenido, url, "Fotografía de un gato", signal);
}

async function cargarDato(contenido, signal) {
    const datos = await solicitarJSON(endpoints.datos, signal);
    contenido.querySelector("[data-dato]").textContent = leerTexto(datos.text, "text");
}

async function mostrarImagen(contenido, url, descripcion, signal) {
    signal.throwIfAborted();

    const imagen = new Image();
    imagen.alt = descripcion;
    const cancelarImagen = () => imagen.removeAttribute("src");
    signal.addEventListener("abort", cancelarImagen, { once: true });

    try {
        imagen.src = url;
        // Conserva la imagen anterior hasta que el navegador pueda mostrar la nueva.
        await imagen.decode();
        contenido.replaceChildren(imagen);
    } finally {
        signal.removeEventListener("abort", cancelarImagen);
    }
}

function iniciarTarjeta(id, cargar, mensajeError) {
    const tarjeta = document.getElementById(id);
    const boton = tarjeta.querySelector("button");
    const contenido = tarjeta.querySelector("[data-contenido]");
    const estado = tarjeta.querySelector(".estado");

    async function actualizar() {
        boton.disabled = true;
        contenido.setAttribute("aria-busy", "true");
        estado.dataset.estado = "cargando";
        estado.textContent = "Cargando…";

        try {
            await cargar(contenido, AbortSignal.timeout(15000));
            estado.dataset.estado = "listo";
            estado.textContent = "Contenido actualizado.";
        } catch (error) {
            console.warn(`No se pudo actualizar la sección ${id}.`, error);
            estado.dataset.estado = "error";
            estado.textContent = `${mensajeError} Vuelve a intentarlo.`;
        } finally {
            contenido.setAttribute("aria-busy", "false");
            boton.disabled = false;
        }
    }

    boton.addEventListener("click", actualizar);
    actualizar();
}

iniciarTarjeta("citas", cargarCita, "No se pudo obtener la cita.");
iniciarTarjeta("perros", cargarPerro, "No se pudo cargar la imagen del perro.");
iniciarTarjeta("gatos", cargarGato, "No se pudo cargar la imagen del gato.");
iniciarTarjeta("datos", cargarDato, "No se pudo obtener el dato curioso.");
