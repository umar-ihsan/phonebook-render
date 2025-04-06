const mongoose = require('mongoose')

const password = process.argv[2]

console.log(`process.argv[] length is ${process.argv.length}`)

const url = `mongodb+srv://umarihsan:${password}@fullstackopen.dzxz01x.mongodb.net/`

mongoose.set('strictQuery',false)


mongoose.connect(url)
.then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })



const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Person = mongoose.model('Person', personSchema)

module.exports = Person



if (process.argv.length == 3) {
    console.log("inside if")
    Person.find({}).then(result=>{
      result.forEach(person => {
          console.log(person)
      
    })

    mongoose.connection.close()   
})}

if (process.argv.length > 3){


    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
      })
      
      person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook.`)
        mongoose.connection.close()
      })
}
