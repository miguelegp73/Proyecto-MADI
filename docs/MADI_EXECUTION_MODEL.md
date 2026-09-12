# M.A.D.I. — Modelo de ejecución

El núcleo de M.A.D.I. separa intención, contexto, planificación, autorización, ejecución y verificación.

```text
Interacción
  ↓
Intención
  ↓
Contexto
  ↓
Plan
  ↓
Autorización
  ↓
Capability Executor
  ↓
Verificación
  ↓
Resultado
```

## Reglas del modelo

- Un plan no ejecuta por sí mismo.
- Una capacidad registrada no implica permiso para ejecutarla.
- Las operaciones de mayor riesgo requieren autorización.
- La ejecución debe pasar por el ejecutor de capacidades.
- La verificación ocurre después de una ejecución cuando existe un resultado que comprobar.
- Los componentes son provider-neutral y no dependen de Windows, un navegador, un LLM o SicherERP.

## Estado de v0.1

Los contratos y adaptadores básicos están definidos. La selección inteligente de capacidades, la planificación real, la autorización avanzada y la verificación contextual todavía requieren evolución antes de conectar herramientas reales.
