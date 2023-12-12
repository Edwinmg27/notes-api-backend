const logger = (request, response, next) => {
  console.log(request.method)
  console.log(request.path)
  console.log(request.body)
  console.log('-----')
  next() // next para que vaya a la siguiente ruta
}

// se exporta como module.exports = logger
module.exports = logger
