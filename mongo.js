const mongoose = require('mongoose')
// const password = require('./password.js')
const { model, Schema } = mongoose
const connectionString = 'mongodb+srv://edwinmg27:8lTwXN7fjcM5Neap@cluster0.x5evyxb.mongodb.net/'

// conexion a mongodb
mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.error(err)
  })

const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean
})

const Note = model('Note', noteSchema)

// creamos una instancia de Note
const note = new Note({
  content: 'MongoDB es increible',
  date: new Date(),
  important: true
})

note.save()
  .then(result => {
    console.log(result)
    mongoose.connection.close()
  }).catch(err => {
    console.error(err)
  })
