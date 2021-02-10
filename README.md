# pataki-node-app :sunglasses:

Proyecto para curso Node.js escalab.

Se utiliza la base desarrollada en clases para realizar tienda online de Pataki Store.

Este proyecto utiliza el siguiente stack de tecnologías:

- Node.js
- Express
- Mongo
- Typescript

Mejoras realizadas en el proyecto:

1. **Typescript**: Para manejar de mejor forma los typos utilizados en la aplicación. Generalmente cuando utilizamos javascript es muy difícil entender a nivel de código cuáles son los parametros de entrada o salida de distintos métodos por ejemplo. Además se pueden generar interfaces para los modelos permitiendo tener una mejor lectura en toda la plicación.

2. **Eslint, Prettier**: Para mejorar el orden se agregan diversas reglas que permiten tener una estructura en el código.
3. **Estándar en respuestas**: Gracias a typescript se agregan interfaces para manejar las respuestas de la api (ResponseError, ResponseApi) en conjunto a esto se agrega httpStatus para manejar códigos en las respuestas.
4. **Evaluation**: Se agrega un nuevo modelo a la aplicación para que los usuarios puedan dejar comentarios y una evaluación a un producto, además se agrega una función para calcular el promedio de esta evaluación y así poder tener una estadística de los productos mejores evaluados de la tienda.


#### Instalación :wrench:

1. Clonar repositorio
```
git clone https://github.com/pataki-app/pataki-node-app.git
```

2. Crear base de datos ``Pataki``

:warning: Previamente se instaló Robo 3T para manejo de base de datos.


3. Crear archivo ``.env.development`` en el proyecto  y agregar las siguientes configuraciones:
```
PORT=3000
URL_MONGO=mongodb://localhost:27017/Pataki
SALT=10
SEED=78964
EXPIRES_IN=1h
SESSION_KEY=secretkey
```

:warning: Considerar cambiar las variables que correspondan según configuración local de base de datos.


4. Instalar dependencias del proyecto:

```
npm install
```

:warning: Tener instalado Node


4. Ejecutar localmente 
```
npm run dev
```

4. La aplicación se ejecutará en el puerto configurado :rocket:


#### Usuario Admin

- Si no existe un usuario del tipo Admin, al inicial la aplicación se crea uno:
  user: admin@pataki.com
  password: pataki123

#### Login

- Para ingresar a algunos endpoints se necesiará haber iniciado sesión anteriormente, para esto se debe hacer login a la app.
