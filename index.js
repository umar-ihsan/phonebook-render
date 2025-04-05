const express = require('express')
const cors = require('cors');
var morgan = require('morgan')

const app = express()

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));


morgan.token('postData', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body); // Log the body of POST requests
    }
    return ''; // For other methods, return an empty string
});

app.use(morgan(':method :url :status :postData'));


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dani Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    const currentDate = new Date().toLocaleString();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    response.send( `
            <div>
                <p>Phonebook has info about ${persons.length} people</p>
            </div>
            <div>
                <p>${currentDate} (${timeZone})</p>
            </div>`)
  })

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person=>person.id==id)

    if(!person){
        return response.status(400).json({
            error: "Person not found."
        })
    }
    console.log(person)
    response.json(person)
  })

app.post('/api/persons', (request, response) => {

    const personName = request.body.name
    const personNumber = request.body.number
    const personId = Math.floor(Math.random()*10000).toString();

    if(!personName || !personNumber){
        return response.status(400).json({
            error: "Person name or number missing."
        })
    }
    
    const exists = persons.find(p=>p.name==personName)

    if(exists){
        return response.status(400).json({
            error: `${personName} already exists in the phonebook.`
        })
    }

    let person = {
        id: personId,
        name: personName,
        number: personNumber
    }

    persons.push(person)

    response.json(person)
  })

app.delete('/api/persons/:id', (request, response)=>{

    const id = request.params.id
    const person = persons.find(p=>p.id==id)
    const filteredPersons = persons.filter(p=>p.id !== id)

    if(!person){
        return response.status(400).json({
            error: "Person not found."
        })
    }
    console.log(filteredPersons)
    response.json(filteredPersons)
  
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})