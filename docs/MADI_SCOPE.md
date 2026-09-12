# M.A.D.I. — Alcance confirmado

## Identidad
M.A.D.I. significa **Módulo Autónomo de Datos e Inteligencia**.

## Alcance del producto
M.A.D.I. es un asistente de propósito general. SicherERP es una integración importante, pero no limita el alcance de M.A.D.I.

El diseño debe permitir incorporar capacidades para:

- Control e interacción con el PC y el sistema operativo.
- Apertura y uso de programas y aplicaciones.
- Gestión de archivos y documentos.
- Navegación y búsqueda en Internet.
- Interacción con servicios y aplicaciones externas.
- Integración con SicherERP.
- Integración con Inspector IA.
- Integración con futuras aplicaciones.
- Interacción por texto y, posteriormente, voz natural.
- Una interfaz visual/avatar dinámica como capa de presentación futura.

## Principio arquitectónico
Las capacidades se incorporan como módulos/adaptadores independientes. El núcleo de M.A.D.I. no debe quedar acoplado a Windows, un navegador, SicherERP, Inspector IA, un proveedor de IA o una aplicación concreta.

## Seguridad y autonomía
Tener una capacidad disponible no implica ejecutarla automáticamente. La ejecución debe pasar por las reglas de autorización, permisos, trazabilidad y verificación definidas por el núcleo.

**Propuesta no equivale a ejecución.**
