# Mótu web — reglas para cualquier agente

- La interfaz y la comunicación con Eduardo van en español sencillo.
- Nunca trabajar directamente en `main`: una rama y una propuesta por cambio.
- Nunca cambiar DNS, dominios o servicios de producción. Solo Eduardo publica
  esos cambios después de revisar una vista previa.
- No añadir secretos, llaves, datos de usuarios ni capturas privadas.
- Ejecutar `npm test` antes de dar un cambio por terminado.
- Mantener la web estática. Formularios, analítica, cookies o conexiones con la
  app requieren un plan aprobado antes de implementarse.
- Mótumotu es secundario; las pantallas reales de la app conservan el
  protagonismo.
- El CTA de TestFlight usa el correo de soporte hasta que exista un enlace público
  real. Nunca inventar una URL de invitación.
