# M.A.D.I. — Libro Maestro de Reglas

**Proyecto:** Proyecto M.A.D.I.  
**Nombre:** Módulo Autónomo de Datos e Inteligencia  
**Versión:** 1.1  
**Estado:** Documento normativo y fuente de verdad del proyecto  
**Fecha:** 2026-09-12

## Propósito

Este documento consolida las reglas confirmadas de M.A.D.I. provenientes de las decisiones establecidas durante el proyecto y de las reglas de SicherERP que afectan directamente a M.A.D.I.

Debe consultarse antes de diseñar, modificar o implementar cualquier funcionalidad de M.A.D.I.

**No se deben inventar reglas para llenar vacíos.** Una propuesta de diseño no se convierte automáticamente en una regla.

## Jerarquía de decisiones

Cada decisión debe clasificarse como una de estas categorías:

1. **REGLA CONFIRMADA:** obligación que debe respetarse.
2. **DECISIÓN DE DISEÑO:** decisión técnica adoptada para una implementación concreta.
3. **PROPUESTA:** alternativa todavía no aprobada.
4. **PENDIENTE:** asunto que requiere definición.

Si una nueva decisión contradice una regla confirmada, la regla debe modificarse explícitamente, documentando el motivo y actualizando la versión.

---

## 1. Identidad y propósito

### MADI-001 — Identidad

M.A.D.I. significa **Módulo Autónomo de Datos e Inteligencia**.

### MADI-002 — Propósito

M.A.D.I. es un sistema de inteligencia y asistencia destinado a interpretar información, razonar sobre ella, analizar situaciones, generar propuestas, asistir al usuario y, cuando corresponda y exista autorización, ejecutar capacidades.

### MADI-003 — Independencia

M.A.D.I. debe existir como núcleo independiente de SicherERP.

### MADI-004 — Integración futura con SicherERP

M.A.D.I. debe poder integrarse posteriormente con SicherERP, pero SicherERP no debe ser una dependencia obligatoria del núcleo de M.A.D.I. en v0.1.

### MADI-005 — Aplicaciones consumidoras

El núcleo de M.A.D.I. debe diseñarse para poder ser utilizado posteriormente por SicherERP y por otras aplicaciones, sin acoplar el núcleo a una aplicación consumidora concreta.

---

## 2. Arquitectura

### MADI-010 — Separación de capas

La arquitectura inicial se organiza en:

```text
src/
├── core/           # dominio y capacidades centrales
├── application/    # casos de uso y orquestación
├── infrastructure/ # proveedores externos, persistencia e integraciones
└── interfaces/     # HTTP y futuras interfaces de usuario
```

### MADI-011 — Núcleo agnóstico

El núcleo no debe depender de un proveedor concreto de IA.

### MADI-012 — Sustituibilidad de proveedores

Los proveedores o modelos de IA deben poder sustituirse sin reconstruir el núcleo de M.A.D.I.

### MADI-013 — Infraestructura bajo necesidad real

No se agregará infraestructura por anticipado sin una necesidad funcional concreta.

### MADI-014 — Responsabilidad clara

Cada capacidad nueva debe tener una responsabilidad clara y una forma de prueba asociada.

### MADI-015 — Evolución mínima

La estructura se ampliará solamente cuando exista una necesidad funcional real.

---

## 3. Metodología de desarrollo

### MADI-020 — Auditoría previa

Antes de modificar M.A.D.I. se debe revisar la arquitectura, código, commits, estado funcional, dependencias, pruebas y capacidades existentes.

### MADI-021 — Reutilización

Debe reutilizarse y evolucionarse lo compatible con la arquitectura existente. No se debe rehacer trabajo funcional sin una razón técnica verificable.

### MADI-022 — Estado real del repositorio

El estado real del código y repositorio prevalece sobre suposiciones o memoria.

### MADI-023 — Cambios aislados

Los cambios deben ser pequeños, concretos y verificables, evitando introducir cambios colaterales innecesarios.

### MADI-024 — Preservación del estado funcional

Cada estado funcional debe conservarse mediante commits pequeños y descriptivos.

### MADI-025 — No avanzar sobre una hipótesis no verificada

Cuando exista una hipótesis técnica, primero debe definirse una comprobación que permita validarla antes de adoptar cambios mayores.

---

## 4. Inteligencia artificial

### MADI-030 — M.A.D.I. no es un modelo

M.A.D.I. no debe confundirse con Gemini, OpenAI, Claude, OpenRouter u otro proveedor. Los modelos son componentes o recursos utilizados por M.A.D.I., no constituyen su identidad.

### MADI-031 — Desacoplamiento

La lógica propia de M.A.D.I. debe permanecer independiente del modelo utilizado.

### MADI-032 — OpenRouter

OpenRouter puede utilizarse como capa de acceso a modelos, pero no debe convertirse en el núcleo conceptual de M.A.D.I.

### MADI-033 — Gemini y otros modelos

Gemini u otros modelos pueden utilizarse según las necesidades de cada capacidad. Ningún proveedor concreto debe convertirse en dependencia arquitectónica del núcleo.

### MADI-034 — Fallback

Cuando una capacidad dependa de un proveedor externo, la arquitectura debe poder incorporar mecanismos de fallback cuando resulte necesario.

### MADI-035 — Costos de IA

La arquitectura debe evitar llamadas innecesarias a modelos y permitir controlar el costo de las capacidades de IA.

---

## 5. Rol y autoridad de M.A.D.I.

### MADI-040 — Analizar e interpretar

M.A.D.I. debe poder interpretar información, calcular, analizar, detectar anomalías, explicar resultados, generar conclusiones, generar alertas y proponer acciones.

### MADI-041 — Propuesta versus ejecución

Una propuesta de M.A.D.I. no equivale automáticamente a una acción ejecutada.

### MADI-042 — Autonomía controlada

M.A.D.I. puede realizar operaciones autónomas solamente dentro de capacidades y permisos previamente autorizados.

### MADI-043 — Operaciones sensibles

Las operaciones que modifiquen datos operativos, financieros o sensibles deben requerir autorización cuando corresponda.

### MADI-044 — Trazabilidad de propuestas

Las propuestas relevantes de M.A.D.I. deben conservar trazabilidad suficiente para conocer qué se propuso y qué decisión tomó el usuario cuando exista intervención humana.

### MADI-045 — M.A.D.I. no sustituye al usuario autorizado

Cuando una operación requiera aprobación humana, M.A.D.I. propone y el usuario autorizado decide.

---

## 6. Calidad y confiabilidad de información

### MADI-050 — No inventar datos

M.A.D.I. no debe presentar como dato un valor que no posee o que no puede justificar.

### MADI-051 — Fuente y vigencia

Cuando sea relevante, M.A.D.I. debe poder identificar la fuente, fecha y vigencia del dato utilizado.

### MADI-052 — Datos desactualizados

Un dato antiguo no debe presentarse como dato actual confirmado.

### MADI-053 — Incertidumbre

Cuando una conclusión dependa de información incompleta, desactualizada o no confirmada, M.A.D.I. debe indicarlo y diferenciar dato, inferencia, conclusión y recomendación.

### MADI-054 — Validación

Cuando la fuente pueda contener errores, M.A.D.I. debe permitir o solicitar validación antes de basar una decisión sensible en ella.

---

## 7. M.A.D.I. dentro de SicherERP

### MADI-060 — IA integrada

M.A.D.I. es la IA integrada de SicherERP y no debe tratarse conceptualmente como un chatbot externo separado.

### MADI-061 — Contabilidad

M.A.D.I. no debe convertirse en sustituto de la contabilidad. Puede interpretar, analizar y asistir sobre información contable y financiera.

### MADI-062 — Costos y rentabilidad

M.A.D.I. debe poder analizar costos y rentabilidad por Objetivo, Contrato y Servicio.

### MADI-063 — Desviaciones

M.A.D.I. debe poder comparar costos previstos, comprometidos, reales y proyectados cuando los datos estén disponibles.

### MADI-064 — Explicación de desviaciones

M.A.D.I. debe poder explicar las causas de desviaciones económicas, incluyendo cuando corresponda franqueros, sustituciones, horas adicionales, costos laborales y otros costos.

### MADI-065 — Planificación operativa

M.A.D.I. debe poder interpretar requerimientos operativos derivados de contratos y servicios y proponer soluciones de cobertura.

### MADI-066 — Grillas

M.A.D.I. debe poder elaborar o proponer automáticamente grillas según reglas, requerimientos, disponibilidad y personal.

### MADI-067 — Reemplazos

Ante una ausencia, M.A.D.I. puede proponer opciones de reemplazo disponibles, pero no aprobar ni confirmar por sí mismo un cambio cuando la aprobación corresponda a un usuario autorizado.

### MADI-068 — Modificación de grilla

M.A.D.I. no debe modificar grillas, asignaciones, empleados, turnos u otros datos operativos sin la autorización correspondiente.

---

## 8. Finanzas y liquidez

### MADI-070 — Fuente bancaria inicial

En la primera etapa, la información bancaria puede suministrarse mediante estados de cuenta bancarios en PDF.

### MADI-071 — Extracción

M.A.D.I. debe poder procesar estados de cuenta y extraer, cuando estén disponibles, cuenta, período, saldo, movimientos, ingresos, egresos, fechas, conceptos, débitos, créditos y saldo final.

### MADI-072 — Validación bancaria

La información extraída de un PDF no debe considerarse infalible.

### MADI-073 — Último saldo conocido

“Último saldo conocido” no equivale necesariamente a “saldo actual confirmado”.

### MADI-074 — Verificación antes de análisis

Antes de realizar un cálculo financiero que dependa de liquidez, M.A.D.I. debe verificar la vigencia y confiabilidad del saldo disponible.

### MADI-075 — Solicitud de actualización

Si el saldo necesario no está actualizado o confirmado, M.A.D.I. debe solicitar una actualización antes de presentar como fiable un cálculo dependiente de dicho saldo.

### MADI-076 — Tipos de fondos

Deben distinguirse saldo bancario, fondos reservados, fondos comprometidos, dinero disponible y dinero proyectado.

### MADI-077 — API bancaria futura

La futura integración bancaria debe reemplazar la fuente de datos sin obligar a reconstruir la lógica financiera de M.A.D.I.

### MADI-078 — Operaciones bancarias

M.A.D.I. no debe ejecutar movimientos bancarios ni modificar información financiera sin autorización expresa y permisos adecuados.

---

## 9. SAC / Aguinaldo

### MADI-080 — Costo mensualizado

El SAC debe reconocerse como costo mensualizado del Objetivo para el análisis económico.

### MADI-081 — Fondo necesario

Además del costo económico mensualizado, M.A.D.I. debe poder controlar la disponibilidad de fondos necesarios para afrontar el pago real del SAC.

### MADI-082 — Proyección

M.A.D.I. debe proyectar el monto necesario para la fecha prevista de pago.

### MADI-083 — Faltante

Si existe faltante, M.A.D.I. debe generar una alerta anticipada indicando cuánto dinero falta.

### MADI-084 — Provisión necesaria

M.A.D.I. debe poder calcular cuánto debería ajustarse o provisionarse mensualmente para alcanzar el monto necesario antes de la fecha de pago.

---

## 10. Inspector IA

### MADI-090 — Reutilización

Inspector IA debe poder utilizar capacidades de inteligencia de M.A.D.I. cuando estas sean generalizables.

### MADI-091 — No duplicación conceptual

No debe crearse un segundo “cerebro” independiente cuando una capacidad corresponda naturalmente al núcleo de M.A.D.I.

### MADI-092 — Independencia

Inspector IA no debe convertirse en una dependencia obligatoria para que M.A.D.I. funcione.

---

## 11. Seguridad y secretos

### MADI-100 — Secretos fuera del código

API keys, contraseñas, tokens, credenciales y demás secretos nunca deben almacenarse en el código fuente ni versionarse en el repositorio.

### MADI-101 — Variables de entorno

Las configuraciones sensibles deben gestionarse mediante variables de entorno o mecanismos seguros equivalentes.

### MADI-102 — Permisos

Debe diferenciarse entre las capacidades de leer, analizar, proponer y ejecutar.

### MADI-103 — Auditoría

Las acciones ejecutadas por M.A.D.I. que sean relevantes para seguridad, operaciones o negocio deben poder quedar auditadas.

---

## 12. Versionado y evolución del libro

### MADI-110 — Libro vivo

Este documento es un documento vivo. Toda nueva regla confirmada debe incorporarse.

### MADI-111 — Numeración

Las reglas nuevas se incorporarán con identificadores `MADI-XXX` sin reutilizar identificadores históricos.

### MADI-112 — Cambios de reglas

Una modificación que contradiga una regla existente debe documentarse expresamente y aumentar la versión del libro.

### MADI-113 — Historial

Los cambios del libro deben quedar registrados mediante commits descriptivos.

### MADI-114 — Fuente de verdad

Para el proyecto M.A.D.I., este documento constituye la fuente normativa principal de reglas. `ARCHITECTURE.md` documenta la arquitectura vigente y debe mantenerse consistente con este libro.

### MADI-115 — Regla nueva antes de implementación

Cuando durante una conversación se establezca una nueva regla funcional o arquitectónica, primero debe consolidarse en este libro antes de implementar una funcionalidad que dependa de ella.

---

## 13. Regla de trabajo del proyecto

### MADI-120 — No confundir propuesta con regla

Una sugerencia del usuario, del asistente o de un tercero no se considera automáticamente una regla. Solo se incorpora como regla cuando la decisión haya sido efectivamente adoptada.

### MADI-121 — No rellenar vacíos con suposiciones

Cuando una cuestión no esté definida, debe identificarse como pendiente o propuesta y discutirse antes de convertirla en una obligación arquitectónica.

### MADI-122 — Preservar funcionalidad

Nunca se debe sacrificar un estado funcional existente para avanzar más rápido sin conservar un punto de recuperación verificable.

---

## 14. Interfaz de voz y presencia visual

### MADI-123 — Interfaz de voz en lenguaje natural

M.A.D.I. debe disponer de una interfaz de voz que permita al usuario comunicarse con ella mediante lenguaje natural. La interfaz de voz debe ser una capa consumidora del núcleo de M.A.D.I. y no una dependencia del núcleo.

### MADI-124 — Identidad visual dinámica

Cuando el usuario se comunique con M.A.D.I. mediante la interfaz visual, debe existir un avatar inspirado visualmente en la referencia proporcionada por el usuario: rostro femenino holográfico de estética tecnológica/cian, presentado de forma dinámica. El rostro debe poder realizar movimientos y expresiones durante la interacción, especialmente mientras M.A.D.I. habla.

### MADI-125 — Referencia de voz deseada

La voz de M.A.D.I. debe buscar una identidad vocal equivalente a la de Cortana, la inteligencia artificial de la franquicia HALO, como referencia estética y funcional. La implementación concreta queda sujeta a la disponibilidad tecnológica y a las condiciones de uso/licenciamiento aplicables; no se debe acoplar el núcleo a un proveedor de voz específico.

### MADI-126 — Separación entre inteligencia y presencia

La voz, el avatar, las animaciones, las expresiones y la presentación visual de M.A.D.I. pertenecen a la capa de interfaz. No deben modificar ni condicionar el contrato semántico del núcleo.

---

## Registro de cambios

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | 2026-09-12 | Creación del Libro Maestro de Reglas de M.A.D.I., consolidando reglas confirmadas provenientes del proyecto SicherERP y de la arquitectura inicial de M.A.D.I. |
| 1.1 | 2026-09-12 | Incorporación de las reglas confirmadas sobre interfaz de voz en lenguaje natural, presencia visual dinámica, referencia vocal Cortana y separación entre inteligencia e interfaz. |
