# M.A.D.I. Rulebook v1.3

**Última actualización:** 2026-09-12

## MADI-136 — Activación natural de M.A.D.I.
La activación de M.A.D.I. no debe depender de una única frase rígida. El sistema debe admitir el nombre **M.A.D.I.** y variantes naturales dirigidas a ella, como «Hola M.A.D.I.», «Buen día M.A.D.I.», «Buenas tardes M.A.D.I.» y «Buenas noches M.A.D.I.». La activación por wake phrase no autentica al usuario.

## MADI-137 — Wake phrase con límites de palabra
La detección provisional basada en texto/STT debe reconocer M.A.D.I. como nombre independiente y no como una coincidencia arbitraria dentro de otra palabra.

## MADI-138 — Wake-only no inicia una conversación vacía
Cuando una utterance contiene únicamente la activación o un saludo dirigido a M.A.D.I., la interfaz debe activar la sesión de escucha sin enviar una interacción vacía al núcleo conversacional. Una orden adicional en la misma utterance sí puede continuar al flujo conversacional.
