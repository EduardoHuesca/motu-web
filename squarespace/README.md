# Publicar la landing en Squarespace

Squarespace es el alojamiento final de `mootuapp.com`. GitHub Pages se conserva
solo como vista previa y como fuente versionada.

## Antes de sustituir la página actual

1. Duplicar la página de inicio actual para conservar una reversión sencilla.
2. Crear una página vacía en **No enlazado**.
3. Añadir una sección en blanco y un único bloque **Código**.
4. Copiar dentro el contenido completo de `motu-code-block.html`.
5. Revisar la vista de escritorio y móvil sin convertirla todavía en inicio.

El paquete usa solo HTML y CSS, por lo que no depende de las funciones de
JavaScript de los planes Core, Plus o Advanced. Las imágenes se sirven desde la
vista previa de GitHub mientras se revisa. Después pueden subirse a los archivos
personalizados de Squarespace y sustituirse sus direcciones sin cambiar el
diseño.

## Publicación manual

Cuando la vista previa coincida con el mockup, Eduardo puede establecer esa
página como inicio. No es necesario cambiar DNS, transferir el dominio ni tocar
los registros de correo.

Para regenerar el bloque después de un cambio:

```sh
npm run build:squarespace
```

`index.html` y `styles.css` son la única fuente; el bloque generado no se edita a
mano.
