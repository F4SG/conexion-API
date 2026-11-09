# Explorador de contenido aleatorio

**Programación Web III**

## Integrantes

- Salas Gutierrez Franco Andres

## Cómo ejecutar la página

1. Extrae el ZIP en una carpeta y conserva juntos `index.html`, `estilos.css` y `explorador.js`.
2. Abre `index.html` en un navegador actualizado con JavaScript e Internet disponibles. También puedes servir la carpeta por HTTP. Si tienes Python, ejecuta `python -m http.server 8000` en esa carpeta y abre `http://localhost:8000`.
3. Al abrir la página se consultan las cuatro APIs. Pulsa el botón de una tarjeta para consultar nuevamente su API. Un resultado aleatorio puede repetirse.

## Preguntas de reflexión

### 1. ¿Qué es un endpoint y cuál utilizaste para cada API?

Un endpoint es una dirección de una API que se consulta mediante un método HTTP para realizar una operación. La página utiliza el método `GET` en los cuatro casos.

| API | Endpoint | Campos utilizados |
| --- | --- | --- |
| DummyJSON | `https://dummyjson.com/quotes/random` | `quote` y `author` |
| Dog CEO | `https://dog.ceo/api/breeds/image/random` | `message`, que contiene la URL de la imagen |
| CATAAS | `https://cataas.com/cat?json=true` | `url` o, en su ausencia, `id` para construir `https://cataas.com/cat/{id}` |
| Useless Facts | `https://uselessfacts.jsph.pl/api/v2/facts/random?language=en` | `text` |

### 2. ¿Qué diferencia existe entre recibir JSON y recibir directamente una imagen?

JSON es texto estructurado. Al interpretarlo, JavaScript puede leer propiedades como `author` o `url`. Una imagen es un archivo binario que el navegador decodifica y muestra con `<img>`. En CATAAS, `?json=true` devuelve los metadatos. La URL que indican esos metadatos se asigna al atributo `src` para cargar la imagen.

### 3. ¿Qué función cumplen `await` y `response.json()`?

`await` suspende la ejecución de la función asíncrona hasta que se resuelve una promesa y permite que el resto de la página siga respondiendo. Primero se usa para esperar la respuesta de `fetch`. Después, `response.json()` lee el cuerpo de la respuesta e interpreta el JSON. El segundo `await` obtiene el valor de JavaScript resultante.

### 4. ¿Por qué se debe verificar `response.ok` además de utilizar `try/catch`?

`fetch` puede resolver su promesa aunque el servidor responda con HTTP 404 o 500. `response.ok` indica si el código está entre 200 y 299. Si es falso, el código lanza un error para que `catch` muestre el mensaje de la tarjeta. El mismo bloque maneja fallos de red, errores al interpretar el JSON e imágenes que no se pueden cargar. El bloque `finally` habilita el botón para reintentar.

### 5. ¿Cómo lograste actualizar una sección sin recargar toda la página?

Cada botón de tipo `button` tiene un manejador de clic que llama a la función de su API. La función recibe el contenedor de esa tarjeta y modifica su texto con `textContent` o reemplaza la imagen con `replaceChildren`. Cada tarjeta gestiona por separado su botón y su mensaje de estado.

## Cómo reproducir el error controlado

1. Abre la página y espera a que se carguen las cuatro tarjetas.
2. En las herramientas de desarrollo del navegador, abre **Red** y selecciona **Sin conexión**.
3. Pulsa el botón de una tarjeta. Debe aparecer un mensaje que permite reintentar. Los demás contenidos permanecen disponibles.
4. Restaura la conexión y pulsa nuevamente el mismo botón.

## Capturas

- [Las cuatro secciones con contenido de las APIs](capturas/01-cuatro-secciones.png)
- [Error controlado al bloquear temporalmente la consulta de citas](capturas/02-error-controlado.png)

## Documentación

- [DummyJSON](https://dummyjson.com/docs/quotes)
- [Dog CEO](https://dog.ceo/dog-api/documentation/random)
- [CATAAS](https://cataas.com/)
- [Useless Facts](https://uselessfacts.jsph.pl/)
