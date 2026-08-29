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

## Publicación

Todo cambio entra mediante una propuesta contra `main`. Al integrarse, GitHub
Pages prepara la versión publicada. Cambiar el DNS de `mootuapp.com` es una tarea
posterior y manual de Eduardo; no forma parte de una propuesta normal de código.

La primera versión se extrajo del commit
`4eafcd2d6c059633e9cba7d7fa121f1f1d22112d` de
`EduardoHuesca/ciudad-desbloqueada`.
