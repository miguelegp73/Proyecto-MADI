# M.A.D.I. — Contrato del núcleo de interacción

**Versión:** 0.1  
**Estado:** Decisión de diseño para v0.1

## Objetivo

Definir el contrato interno mediante el cual una aplicación o interfaz puede comunicarse con el núcleo de M.A.D.I. sin acoplarlo a una aplicación concreta, a una interfaz concreta ni a un proveedor de inteligencia artificial.

Este contrato es deliberadamente independiente de Gemini, OpenAI, Claude, OpenRouter, voz, texto, navegador, escritorio o cualquier otra tecnología de presentación.

## Principio central

```text
Aplicación / Interfaz
        |
        v
M.A.D.I. Core Contract
        |
        v
Orquestación de M.A.D.I.
        |
        +---- proveedor/modelo de IA
        +---- memoria
        +---- herramientas
        +---- datos / integraciones
```

La interfaz transforma la interacción humana a un mensaje comprensible por M.A.D.I. y presenta la respuesta recibida. El núcleo no necesita conocer cómo se presentó la interacción.

## Solicitud

Toda solicitud al núcleo debe poder identificar:

- `requestId`: identificador único de la solicitud.
- `timestamp`: momento de creación de la solicitud.
- `source`: aplicación o interfaz que originó la solicitud.
- `input`: contenido semántico recibido.
- `context`: contexto opcional necesario para interpretar la solicitud.
- `permissions`: capacidades autorizadas para esa interacción.
- `metadata`: información técnica adicional no esencial para el razonamiento.

### Fuente

`source.applicationId` identifica al consumidor y no debe utilizarse para crear lógica específica del consumidor dentro del núcleo.

`source.interface` identifica el canal de entrada, por ejemplo `text` o `voice`, pero el núcleo debe trabajar sobre el contenido semántico y no sobre una tecnología de captura concreta.

## Entrada

El contrato inicial admite:

- `text`: lenguaje natural escrito.
- `voice`: lenguaje natural proveniente de una interfaz de voz después de su transcripción.
- `structured`: información estructurada enviada por una aplicación.

El contenido de voz no obliga al núcleo a conocer el motor de reconocimiento de voz utilizado.

## Respuesta

Toda respuesta debe conservar la relación con la solicitud mediante `requestId` y expresar claramente su estado.

Estados iniciales:

- `completed`: M.A.D.I. pudo completar el procesamiento solicitado.
- `needs_input`: necesita información adicional.
- `needs_authorization`: requiere autorización antes de continuar con una operación.
- `rejected`: la solicitud no puede procesarse bajo las capacidades o permisos disponibles.
- `failed`: ocurrió un error técnico durante el procesamiento.

## Contenido de la respuesta

El contrato distingue conceptualmente:

1. **Datos:** información recibida o recuperada de una fuente.
2. **Inferencias:** interpretación derivada de los datos.
3. **Conclusiones:** resultado del análisis.
4. **Recomendaciones:** acciones sugeridas por M.A.D.I.
5. **Propuestas de acción:** operaciones que podrían ejecutarse.
6. **Autorización:** indicación de si una propuesta requiere decisión humana.

M.A.D.I. no debe presentar una inferencia como si fuera un dato confirmado.

## Ejecución

Una propuesta de acción no significa que la acción haya sido ejecutada.

Cuando una acción requiera autorización, la respuesta debe poder expresar:

- qué se propone;
- por qué se propone;
- qué permiso falta;
- qué decisión debe tomar el usuario autorizado.

La ejecución será responsabilidad de una capacidad autorizada y se incorporará en una etapa posterior.

## Incertidumbre y fuentes

Cuando sea relevante, el contrato debe poder transportar:

- fuente del dato;
- fecha o momento de obtención;
- vigencia conocida;
- nivel de confianza o estado de confirmación;
- advertencias sobre información incompleta o desactualizada.

No se define todavía un algoritmo de cálculo de confianza. Eso queda pendiente de una decisión posterior.

## Voz y avatar

La futura interfaz de voz de M.A.D.I. será una **interfaz consumidora del contrato**, no una dependencia del núcleo.

La conversación por voz en lenguaje natural podrá utilizar:

```text
Micrófono
   ↓
Reconocimiento de voz
   ↓
M.A.D.I. Core Contract
   ↓
Respuesta semántica
   ↓
Síntesis de voz
   ↓
Avatar / interfaz visual
```

La identidad visual del avatar, sus movimientos, expresiones y animaciones pertenecen a la capa de interfaz y no deben introducir dependencias dentro del núcleo.

## Compatibilidad futura

El contrato debe permitir que:

- SicherERP consuma M.A.D.I.;
- Inspector IA reutilice capacidades generalizables;
- una futura aplicación de escritorio consuma M.A.D.I.;
- una interfaz web consuma M.A.D.I.;
- una interfaz de voz consuma M.A.D.I.;
- los proveedores de IA puedan cambiarse sin modificar el contrato central.

## Fuera de alcance de este contrato

Todavía no se define aquí:

- proveedor de IA;
- modelo concreto;
- memoria persistente;
- herramientas;
- base de datos;
- autenticación concreta;
- transporte HTTP/WebSocket concreto;
- reconocimiento de voz;
- síntesis de voz;
- motor de animación del avatar.

Cada uno deberá incorporarse solamente cuando exista una necesidad funcional y una decisión técnica verificable.
