# Proyecto M.A.D.I.

**M.A.D.I. — Módulo Autónomo de Datos e Inteligencia**

Proyecto independiente de inteligencia y asistencia, diseñado desde el inicio para poder integrarse posteriormente con **SicherERP**, Inspector IA y otras aplicaciones.

## Versión

`v0.1` — Fundación ejecutable y primer entorno de uso personal.

## Estado actual

La base de M.A.D.I. está implementada y verificada mediante build, pruebas unitarias y pruebas E2E del núcleo HTTP. Incluye:

- núcleo NestJS ejecutable;
- interfaz visual de navegador;
- entrada por micrófono mediante las APIs del navegador;
- activación por variantes naturales de "Hola M.A.D.I.";
- autenticación local por credencial;
- sesiones y conversaciones en memoria;
- memoria local persistente para interacciones;
- respuestas habladas mediante síntesis del navegador;
- reasoning desacoplado con fallback local y OpenRouter opcional;
- capacidades básicas de estado, hora y consulta de capacidades;
- autorización y verificación;
- agent loop acotado;
- primera capacidad sensible `system.open-url`, protegida por autorización.

El reconocimiento biométrico real con Whispeak, el control avanzado del PC, el lip-sync profesional y las integraciones externas siguen siendo etapas posteriores. No se simulan como funcionalidades terminadas.

## Ejecutar localmente

### Requisitos

- Node.js 22.
- Navegador moderno con soporte de micrófono y Speech Recognition.

### Instalación

```bash
npm install
```

### Configuración local

Copiar `.env.example` como `.env` y establecer una credencial propia:

```text
MADI_CREDENTIAL_TYPE=local
MADI_CREDENTIAL_SECRET=TU_CREDENCIAL_LOCAL
MADI_USER_ID=miguel
MADI_DISPLAY_NAME=Miguel
PORT=3000
```

**No subir `.env` al repositorio ni compartir la credencial.**

### Arranque

```bash
npm run start:dev
```

Después abrir:

`http://localhost:3000/madi`

La primera vez, el navegador solicitará permiso para utilizar el micrófono.

## Primera prueba

1. Crear `.env` con una credencial local propia.
2. Arrancar M.A.D.I. con `npm run start:dev`.
3. Abrir `http://localhost:3000/madi`.
4. Autenticarse mediante la credencial local cuando la interfaz lo solicite.
5. Decir **"Hola M.A.D.I."**.
6. Probar frases como:
   - "¿Cuál es el estado de M.A.D.I.?"
   - "¿Qué hora es?"
   - "¿Qué puedes hacer?"

La voz y el avatar actuales pertenecen a la interfaz de navegador. El avatar ya dispone de estados y animación, pero el lip-sync profesional por fonemas/visemas todavía no está terminado.

## API local

- `GET /health` — estado del servicio.
- `POST /interactions` — frontera HTTP del núcleo de interacción.
- `POST /madi/auth/credential` — autenticación por credencial local.
- `GET /madi` — interfaz visual/voz.

## IA

OpenRouter es opcional. Si `OPENROUTER_API_KEY` no está configurada, M.A.D.I. conserva un proveedor local de fallback. El núcleo no depende conceptualmente de un proveedor concreto.

## Seguridad de v0.1

La wake phrase solamente activa la interacción; no constituye autenticación. La identidad y la autorización están separadas. Las capacidades sensibles deben pasar por la política de autorización antes de ejecutarse.

La credencial local es un mecanismo de arranque para uso personal. No debe considerarse todavía una infraestructura definitiva de usuarios ni una autenticación biométrica de producción.

## Verificación del proyecto

```bash
npm run build
npm test -- --runInBand
npm run test:e2e -- --runInBand
```

El repositorio mantiene CI para ejecutar estas verificaciones automáticamente.

## Próximas etapas evolutivas

- reconocimiento biométrico de voz real y confiable con un proveedor especializado;
- credencial y gestión real de usuarios/permisos;
- persistencia robusta de sesiones y conversaciones;
- lip-sync fonético/visémico sincronizado con TTS;
- herramientas locales para controlar PC y aplicaciones, siempre protegidas por autorización;
- navegación web y acceso controlado a recursos externos;
- integraciones con SicherERP e Inspector IA;
- agentes autónomos acotados y verificables;
- instalador y arranque automático del asistente.

## Principios de desarrollo

- La arquitectura actual y el código del repositorio son la fuente de verdad.
- No rehacer ni romper funcionalidades que ya funcionan.
- Cambios pequeños, verificables y con commits descriptivos.
- Separación clara entre núcleo, aplicación, interfaces e infraestructura.
- Proveedores externos desacoplados del núcleo.
- Secretos únicamente mediante configuración local/segura.
- M.A.D.I. permanece independiente de SicherERP.
