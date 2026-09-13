# Proyecto M.A.D.I.

**M.A.D.I. — Módulo Autónomo de Datos e Inteligencia**

Proyecto independiente de inteligencia y asistencia, diseñado desde el inicio para poder integrarse posteriormente con **SicherERP**, Inspector IA y otras aplicaciones.

## Versión

`v0.1` — Fundación ejecutable y primer entorno de uso personal.

## Estado actual

La base de M.A.D.I. está implementada con núcleo NestJS, interfaz de navegador, micrófono, activación natural, autenticación local por credencial, sesiones, conversaciones, memoria persistente, voz de respuesta, reasoning desacoplado, capacidades, autorización, verificación y agent loop acotado.

Capacidades reales disponibles en v0.1:

- estado de M.A.D.I.;
- hora local;
- consulta de capacidades;
- apertura de URLs HTTP/HTTPS con autorización explícita;
- apertura de aplicaciones Windows de una lista permitida con autorización explícita: Calculadora, Bloc de notas, Paint y Explorador.

La wake phrase activa la interacción, pero no autentica al usuario. Las operaciones sensibles requieren autorización independiente.

## Ejecutar localmente

### Requisitos

- Node.js 22.
- Windows para las capacidades de aplicaciones locales.
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

Después abrir `http://localhost:3000/madi`.

## Prueba rápida

1. Crear `.env`.
2. Ejecutar `npm run start:dev`.
3. Abrir `http://localhost:3000/madi`.
4. Autenticarse mediante la credencial local.
5. Decir **"Hola M.A.D.I."**.
6. Probar:
   - "¿Cuál es el estado de M.A.D.I.?"
   - "¿Qué hora es?"
   - "¿Qué puedes hacer?"
   - "Abre https://www.google.com" — M.A.D.I. debe pedir confirmación antes de abrirlo.
   - "Abre la calculadora" — M.A.D.I. debe pedir confirmación antes de abrirla.

## API local

- `GET /health` — estado del servicio.
- `POST /interactions` — frontera HTTP del núcleo.
- `POST /madi/interaction` — flujo de interacción que prepara autorización para acciones protegidas.
- `POST /madi/auth/credential` — autenticación por credencial local.
- `POST /madi/auth/approve` — confirma una autorización temporal.
- `GET /madi` — interfaz visual y de voz.

## IA y voz

OpenRouter es opcional. Sin `OPENROUTER_API_KEY`, M.A.D.I. conserva un proveedor local de fallback.

La interfaz usa síntesis de voz del navegador y reconocimiento de voz disponible en el navegador. El avatar actual tiene estados y animación; el lip-sync profesional por fonemas/visemas y una voz comercial específica requieren proveedores/configuración externos y no se simulan como terminados.

El reconocimiento biométrico real con Whispeak también queda separado de la credencial local y requiere las credenciales/endpoints de la aplicación Whispeak antes de activarse.

## Seguridad

Las capacidades sensibles nunca deben quedar autorizadas solamente por reconocer una wake phrase. La autorización se valida en el backend y los tokens de aprobación son temporales, ligados a sesión, capacidad y operación, y de un solo uso.

La capacidad de aplicaciones locales usa una lista explícita y no acepta comandos arbitrarios de shell. No permite ejecutar PowerShell, CMD ni programas no registrados.

## Verificación

```bash
npm run build
npm test -- --runInBand
npm run test:e2e -- --runInBand
```

CI ejecuta estas verificaciones automáticamente.

## Fuera de v0.1

Estas capacidades no se deben considerar terminadas todavía:

- biometría vocal real de producción;
- gestión completa de múltiples usuarios y permisos;
- persistencia robusta distribuida;
- lip-sync profesional;
- control general del PC y ejecución arbitraria de programas;
- lectura/escritura general de archivos;
- navegación web autónoma más allá de acciones explícitas;
- integraciones con SicherERP e Inspector IA;
- agentes autónomos de mayor alcance;
- instalador y arranque automático.

## Principios

- La arquitectura y el código del repositorio son la fuente de verdad.
- No romper funcionalidades existentes.
- Cambios pequeños, verificables y con commits descriptivos.
- Separación entre núcleo, aplicación, interfaces e infraestructura.
- Proveedores externos desacoplados del núcleo.
- Secretos únicamente mediante configuración segura.
- M.A.D.I. permanece independiente de SicherERP.
