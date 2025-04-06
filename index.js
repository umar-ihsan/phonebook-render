require('dotenv').config()
const express = require('express')
const cors = require('cors');
var morgan = require('morgan');
const Person = require('./models/person')

const app = express()

app.use(cors());
app.use(express.static('dist'))
app.use(express.json());
app.use(morgan('tiny'));


morgan.token('postData', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body); // Log the body of POST requests
    }
    return ''; // For other methods, return an empty string
});

app.use(morgan(':method :url :status :postData'));


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response, next) => {
    const currentDate = new Date().toLocaleString();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    Person.countDocuments()  // Counts all documents in the 'Person' collection
    .then(count => {
      response.send(`
        <div>
          <p>Phonebook has info about ${count} people</p>
        </div>
        <div>
          <p>${currentDate} (${timeZone})</p>
        </div>`);
    }). catch(error=> next(error))
  })

app.put('/api/persons/:id',(request, response, next)=>{

    const personName = request.body.name
    const personNumber = request.body.number
    const personId = Math.floor(Math.random()*10000).toString();

    if(!personName || !personNumber){
        return response.status(400).json({
            error: "Person name or number missing."
        })
    }
    
    Person.find({_id:request.params.id}).then(exists=>{

      if(exists.length > 0){

        let person = new Person({
          name: personName,
          number: personNumber
        })
        person.save().then(result=> response.json(result))
    }


    }).catch(error=>(next(error)))

})

app.get('/api/persons', (request, response, next) => {

  Person.find({}).then(result=> response.json(result)).catch(error=>next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .lean() 
    .then((person) => {
      if (!person) {
        return response.status(404).json({
          error: "Person not found.",
        });
      }

      console.log(person);
      response.json(person);
    })
    .catch((error) => {
      next(error)
    });
});

app.post('/api/persons', (request, response, error) => {

    const personName = request.body.name
    const personNumber = request.body.number
    const personId = Math.floor(Math.random()*10000).toString();

    if(!personName || !personNumber){
        return response.status(400).json({
            error: "Person name or number missing."
        })
    }
    
    Person.find({name:personName}).then(exists=>{

      if(exists.length > 0){
        return response.status(400).json({
            error: `${personName} already exists in the phonebook.`
        })
    }
    
    let person = new Person({
      name: personName,
      number: personNumber
    })

    person.save().then(result=> response.json(result))

    }).catch(error=>(next(error)))

    
  })

app.delete('/api/persons/:id', (request, response, next)=>{

    const Id = request.params.id
    Person.findOneAndDelete({_id:Id}).then(result=>{

      if(!result){
        return response.status(400).json({
            error: "Person not found."
        })
    }
    
    response.json(result)
        
    }).catch(error=>next(error))
  
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})