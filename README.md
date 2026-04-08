# CRUD de Productos con Express y MongoDB

Aplicacion web que implementa una API REST y una interfaz HTML/CSS/JS para gestionar productos.

## Tecnologias

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- HTML, CSS y JavaScript (Fetch API)

## Requisitos

- Node.js 18 o superior
- Una cadena de conexion a MongoDB (Atlas o local)

## Configuracion

1. Instala dependencias:

```bash
npm install
```

2. Crea un archivo `.env` en la raiz con:

```env
URI=<tu_cadena_de_conexion_mongodb>
PORT=3000
```

## Ejecucion

```bash
npm start
```

La aplicacion quedara disponible en:

- Interfaz web: `http://localhost:3000`
- API REST: `http://localhost:3000/productos`

## Endpoints CRUD

- `POST /productos` crea un producto
- `GET /productos` lista todos los productos
- `GET /productos/:id` obtiene un producto por ID
- `PUT /productos/:id` actualiza un producto
- `DELETE /productos/:id` elimina un producto

## Estructura principal

- `server.js`: configuracion de Express, middlewares y rutas
- `database/db.js`: conexion a MongoDB
- `models/Product.js`: esquema y validaciones con Mongoose
- `routes/productos.js`: endpoints CRUD
- `public/index.html`: formulario y tabla
- `public/app.js`: consumo de API con Fetch
- `public/styles.css`: estilos de la interfaz

## Validaciones implementadas

- Campos obligatorios: nombre, descripcion, precio, stock, categoria
- Precio no negativo
- Stock entero y no negativo
- Categoria con opciones permitidas: Electronica, Ropa, Alimentos

## Entrega sugerida (rubrica)

- Incluir codigo fuente completo.
- Grabar video (maximo 5 minutos) mostrando:
  - Conexion a MongoDB
  - Crear, listar, editar y eliminar productos
  - Respuestas de error por validacion
  - Interfaz funcionando

## Despliegue rapido (opcional para criterio de nube)

Puedes desplegar en Render, Railway o similar:

1. Subir repositorio a GitHub.
2. Crear servicio web con comando `npm start`.
3. Configurar variable de entorno `URI`.
4. Abrir la URL publica generada y probar CRUD.
