# M.A.D.I. — Arquitectura de interfaz de voz

## Objetivo

Preparar una interfaz futura en la que el usuario pueda comunicarse con M.A.D.I. mediante lenguaje natural hablado, recibiendo respuestas habladas y una representación visual dinámica del avatar.

## Regla arquitectónica

La voz y el avatar pertenecen a la capa de interfaz. El núcleo de M.A.D.I. no debe depender de un proveedor de STT, TTS, motor gráfico ni personaje concreto.

## Flujo previsto

`Micrófono → STT → Interaction API → Intent → Context/Memory → Reasoning → Planning → Capability → Verification → respuesta textual → TTS → sincronización avatar`

## Voz

La interfaz deberá poder cambiar el proveedor de reconocimiento y síntesis sin modificar el núcleo. La identidad de voz podrá configurarse como una característica de interfaz.

## Avatar

El avatar deberá soportar como mínimo:

- estado neutral;
- escucha;
- pensamiento;
- habla;
- alegría;
- preocupación;
- error;
- intensidad de expresión;
- progreso de habla para sincronización labial/animación.

La referencia visual y de personalidad definida por el usuario se implementará en la etapa de interfaz, no en el núcleo.

## Seguridad

La interfaz de voz no obtiene permisos adicionales por el hecho de ser voz. Las mismas reglas de autorización, ejecución y verificación se mantienen para texto, voz y futuras interfaces de escritorio.
