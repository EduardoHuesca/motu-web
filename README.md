# Mótu web

Página pública de Mótu. Este repositorio es independiente de la app de iPhone y
Apple Watch: no contiene Swift, conexiones con Supabase ni código del motor de
entrenamiento.

## Vista local

Desde la raíz del repositorio:

```sh
python3 -m http.server 8020
```

Después abre `http://127.0.0.1:8020/`.

## Pruebas

```sh
npm test
```

Las pruebas comprueban la promesa principal, las capturas reales, la navegación,
los textos alternativos y el destino para solicitar TestFlight.

Manrope se distribuye bajo la SIL Open Font License 1.1, incluida en
`assets/OFL.txt`.

## Publicación

Todo cambio entra mediante una propuesta contra `main`. Al integrarse, GitHub
Pages prepara una vista previa comprobable. La página final vive en Squarespace,
donde ya existe el plan anual de Mótu. El paquete para copiarla sin depender de
JavaScript se genera con `npm run build:squarespace`.

Actualizar la página visible de Squarespace es una tarea manual de Eduardo
después de revisar la vista previa; no forma parte de una propuesta normal de
código. El dominio y los registros del correo no se modifican.

La primera versión se extrajo del commit
`4eafcd2d6c059633e9cba7d7fa121f1f1d22112d` de
`EduardoHuesca/ciudad-desbloqueada`.
