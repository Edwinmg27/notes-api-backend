const express = require('express') // requerimos el modulo de express
const cors = require('cors')

const app = express() // ejecutando express, entre () le podemos pasar unas opciones
const logger = require('./loggerMiddleware') // importando el middleware

app.use(cors()) // cors por defecto, hacemos que cualquier origen funcione en la app
app.use(express.json()) // usando el modulo json de express para soportar la request que se esta haciendo cuando se le pasa un objeto y lo parsea para tenerlo disponible en el req.body

app.use(logger)

let notes = [
  {
    id: 1,
    content: 'Hola midudev',
    date: '2023-12-8',
    important: true
  },
  {
    id: 2,
    content: 'Bootcamp FullStack',
    date: '2023-12-8',
    important: false
  },
  {
    id: 3,
    content: 'Aprendiendo a programar',
    date: '2023-12-8',
    important: true
  }
]

/* aqui estamos creando un servidor con http.createServer y le pasamos un parametro, el parametro que se le pasa al createServer se le pasa un CALLBACK. que es un callback? una funcion que se ejecuta cuando ocurre algo. en este caso el callback que le estamos pasando es una funcion que se va a ejecutar cada vez que le llegue una request(una peticion, cada vez que le llegue una peticion al servidor ejecuta la funcion) en el primer parametro (request) le va a llegar informacion de la request, y en el segundo parametro (response) tendra un objeto que es una response que tendra diferentes metodos para devolver la informacion.

--> const App = http.createServer((request, response) => {

Aqui el response esta escribiendo la cabecera de la respuesta con un status code 200, y la cabecera tiene un content-type y el texto es tipo plano,para que el navegador sepa que tipo de datos se devuelve.. El tipo de dato que devolvemos lo tenemos que decir en el Content-Type
--> response.writeHead(200, { "Content-Type": "text/plain" });

y para terminar la respuesta devolvemos el hello world
response.end(JSON.stringify(notes));
}); */

// Utilizando EXPRESS
/* app.get() .get() es porque cuando se haga una peticion del tipo get y le pasamos el path que seria la ruta ('/', (request, response) => {}) la barra / significa cuando entra directamente al dominio, y luego el callback con request y response y dentro de las llaves le diremos lo que tiene que devolver la aplicacion cuando se entra al path la response es lo que devolvera lo que le pongamos */

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

// en ese path devolvemos todas las notas
app.get('/api/notes', (request, response) => {
  // como express es un framework ya viene con cosas resueltas. le podemos decir response.json para decirle que tenemos que devolver con este tipo json
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  // con /:ID estamos diciendo que es dinamico para devolver algo en concreto,es una forma dinamica de recuperar un segmento del path. le estamos diciendo que ese segmento de la ruta lo vamos a capturar con el nombre /:id

  const id = Number(request.params.id) // aqui recuperamos el id, con los parametros de la request, cuando se pone PARAMS se tienen todo los objetos de la ruta dinamica, en las REQUEST siempre va a llegar un STRING y hay que transformarlo en un numero

  const note = notes.find((note) => note.id === id) // aqui recuperamos una nota que el id sea la misma que estamos recuperando por la request

  if (note) {
    response.json(note)
  } else {
    // devolviendo un status code desde servidor express
    response.status(404).end()
  }
  // response.send(id); // aqui respondemos con el ID directamente
})

// Añadiendo DELETE a la API
// Como hacemos el delete? usamos la herramienta POSTMAN O INSOMNIA para ver el request
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter((note) => note.id !== id)
  response.status(204).end()
})

// POST nos permite crear un recurso en la direccion de notes. que sera una nota
app.post('/api/notes', (request, response) => {
  const note = request.body
  if (!note || !note.content) {
    response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const ids = notes.map((note) => note.id)
  const maxId = Math.max(...ids)

  // crear nueva nota
  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }

  notes = [...notes, newNote]
  response.status(201).json(newNote)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})

// aqui le estamos diciendo al servidor que escuche el puerto 3001, por defecto cuando entramos a paginas web el puerto que se escucha es el puerto 80 si es en http y si es https por defecto es el 443 que por defecto es el ssl, el puerto 80 no se debe poner.
// IMPORTANTE,al dejar de usar un serve, se debe detener. De lo contrario queda ocupando el puerto hasta que lo mates o reinicie la compu
const PORT = express.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
// El servidor en express se inicia asincrono, entonces le pasamos un callback de forma que se le dice cuando termine el servidor de levantarse ejecuta esto  console.log(`Server running on port ${PORT}`); porque hay una peque;a latencia en lo que puede tardar
