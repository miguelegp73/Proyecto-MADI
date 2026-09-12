# M.A.D.I. — Implementación de interfaz visual

## Estado

La interfaz web incorpora una primera implementación visual dinámica del avatar de M.A.D.I. sobre tecnologías nativas del navegador.

## Capacidades implementadas

- Rostro holográfico vectorial generado por HTML/CSS.
- Estados visuales: escucha, pensamiento, habla y error.
- Animación de ojos y cejas.
- Animación continua del entorno holográfico.
- Movimiento de boca durante TTS.
- Sincronización temporal de la animación de boca con el ciclo de `speechSynthesis`.
- Respuesta visual durante procesamiento.
- Integración directa con la respuesta textual de `/interactions`.

## Limitación conocida

El movimiento de boca actual es una sincronización visual temporal basada en el ciclo de habla del navegador, no un lip-sync fonema-a-fonema. La arquitectura del núcleo no cambia y permite sustituir posteriormente este renderer por un avatar 2D/3D y un motor de lip-sync real.

La identidad visual debe evolucionar a partir de la referencia visual definida para M.A.D.I.; esta implementación no presupone una identidad de una persona real.

## Regla arquitectónica

El avatar permanece en la capa de interfaz. No introduce dependencias del renderer, navegador o motor gráfico en el núcleo de M.A.D.I.
