# Proyecto M.A.D.I.

**M.A.D.I. — Módulo Autónomo de Datos e Inteligencia**

Proyecto independiente de inteligencia y asistencia, diseñado desde el inicio para poder integrarse posteriormente con **SicherERP**, Inspector IA y otras aplicaciones.

## Versión

`v0.1` — Fundación ejecutable.

## Estado actual

M.A.D.I. ya dispone de un núcleo NestJS ejecutable, interacción HTTP, interfaz visual/voz de navegador, reasoning provider-neutral con fallback local y OpenRouter opcional, capacidades básicas, autorización/verificación, agent loop acotado, sesiones, conversación y una credencial local de arranque.

## Ejecutar localmente

1. Instalar Node.js 22.
2. Instalar dependencias:

```bash
npm install
```

3. Copiar `.env.example` como `.env` y cambiar `MADI_CREDENTIAL_SECRET` por una credencial local propia.
4. Iniciar en desarrollo:

```bash
npm run start:dev
```

5. Abrir en el navegador:

`http://localhost:3000/madi`

También está disponible:

`GET /health`

`POST /interactions`

`POST /madi/auth/credential`

## Autenticación local de arranque

La autenticación por credencial de v0.1 utiliza variables de entorno y sirve como adaptador temporal. No representa todavía el mecanismo definitivo de identidad biométrica ni una infraestructura de usuarios multiusuario.

Variables:

```text
MADI_CREDENTIAL_TYPE=local
MADI_CREDENTIAL_SECRET=...
MADI_USER_ID=miguel
MADI_DISPLAY_NAME=Miguel
```

Nunca subir `.env` ni secretos reales al repositorio.

## IA

OpenRouter es opcional. Si `OPENROUTER_API_KEY` no está configurada, M.A.D.I. conserva un proveedor local de fallback. M.A.D.I. no depende conceptualmente de ningún proveedor concreto.

## Seguridad de v0.1

La interfaz de wake phrase activa la interacción, pero no autentica al usuario. Las capacidades sensibles siguen separadas de la identidad y requieren autorización según las políticas existentes.

## Principios de desarrollo

- Arquitectura modular y extensible.
- Separación clara entre núcleo, interfaces e infraestructura.
- Proveedores de IA desacoplados del núcleo.
- Configuración mediante variables de entorno; nunca almacenar secretos en el repositorio.
- Cambios pequeños, comprobables y con commits funcionales.
- Compatibilidad futura con SicherERP sin acoplar M.A.D.I. a SicherERP.
- Preservar siempre lo que ya funciona.

## Pendientes para una versión de uso personal más completa

- Reconocimiento biométrico de voz real y confiable.
- Credencial definitiva y gestión real de usuarios/permisos.
- Persistencia de sesiones, conversaciones y memoria.
- Integración real del sessionId con cada interacción.
- Lip-sync fonético/visémico real conectado al audio TTS.
- Herramientas locales para controlar PC y aplicaciones, protegidas por autorización.
- Navegación web y acceso controlado a recursos externos.
- Integraciones con SicherERP e Inspector IA.
- Instalador/arranque del asistente en el equipo.
