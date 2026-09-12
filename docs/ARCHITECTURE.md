# Arquitectura inicial — M.A.D.I. v0.1

## Objetivo

M.A.D.I. se construirá como un sistema independiente de inteligencia y asistencia. La integración con SicherERP será una capacidad futura, no una dependencia del núcleo en v0.1.

## Capas iniciales

```text
src/
├── core/          # dominio y capacidades centrales de M.A.D.I.
├── application/   # casos de uso y orquestación
├── infrastructure/# proveedores externos, persistencia e integraciones
└── interfaces/    # HTTP y futuras interfaces de usuario
```

La estructura se ampliará solamente cuando exista una necesidad funcional real.

## Primer objetivo técnico

El primer incremento debe demostrar que la aplicación puede arrancar y responder correctamente a una comprobación de salud. Esto establece la tubería mínima de ejecución antes de incorporar IA, memoria o herramientas.

## Principios

1. El núcleo no debe depender de un proveedor concreto de IA.
2. Las credenciales y configuraciones sensibles viven fuera del código.
3. Cada capacidad nueva tendrá una responsabilidad clara y una prueba asociada.
4. No se agregará infraestructura por anticipado sin una necesidad concreta.
5. Cada estado funcional se conservará mediante commits pequeños y descriptivos.
