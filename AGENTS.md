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

## La cartera de Mótu

El **estado** de las líneas de trabajo de Mótu vive en un tablero local, la
**cartera**, en `http://127.0.0.1:8096`. Se abre con doble clic en
`~/Documents/GitHub/motu-tablero/Cartera.command`.

Reglas de ese tablero, resumidas:

- **Nada se cierra sin evidencia y sin una nota en cristiano**, y la evidencia se
  comprueba de verdad: que la propuesta exista, que se integrara y que sus checks
  salieran verdes.
- **Manda siempre `X-Autor`.** Sin firma se rechaza; lo que escribe una IA nace
  sin revisar.
- **La fase se calcula, no se mueve a mano.**

Al terminar una sesión, deja las tres líneas de la bitácora:

```bash
curl -s -X POST http://127.0.0.1:8096/api/proyecto/CODIGO/bitacora \
  -H "Content-Type: application/json" -H "X-Autor: claude" \
  -d '{"hice":"...","me_quede_en":"...","lo_siguiente":"..."}'
```

Si `http://127.0.0.1:8096/api/salud` no contesta, el tablero está apagado: ábrelo
con su lanzador. Si dice `"conectado": false`, no hay conexión y no se puede
escribir — dilo, y no lo intentes de otra forma.

En la cartera, este repositorio es el proyecto **`WEB`** (la web pública), y su
alias para la evidencia es `web`: `pr:web/1`, `archivo:web/index.html`.
