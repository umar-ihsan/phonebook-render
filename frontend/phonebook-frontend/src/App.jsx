import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/person'
import './index.css'


const Filter = (props) => {
  return (
    <div>
       <br />
     filter with: <input  value = {props.value} onChange={props.onChange}/>
      <br />
    </div>
  )

}

const PersonForm = (props) => {
  return (
    <>
    <form onSubmit={props.onSubmit}>
        <div>
          name: <input  value = {props.nameValue} onChange={props.onNameChange}/>
          <br />
          phone: <input  value = {props.phoneValue} onChange={props.onPhoneChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  )
}

const FilteredPersons = (props) => {
  return (
    <div>
      {
      props.persons.map( person => (
        <div key={person.id}>
          <p>{person.id} - {person.name} - {person.number}</p> 
          <button onClick={()=>props.delete(person)}>delete</button>
        </div>

      ))
      }
    </div>
  )
}

const Notification = ({message}) => {
  if (message === null){
    return null
  }

  return (
   <div className='success'>
    {message}
   </div>
  )
}

const App = () => {


  const [persons, setPersons] = useState([]) 

  useEffect(()=>{
    personService.getAll().then(initialPersons=>setPersons(initialPersons))
  },[])


  const addPerson = (event) => {
    event.preventDefault()
    console.log(`newName is ${newName}`)

    const exists = () =>{
      console.log(`newName is ${newName}`);

      return persons.some(person=> person.name === newName)
      
    }
    if(exists()){
      const confirm = window.confirm(`${newName} is already added in the phonebook.Do you want to update the number?`)
      if(confirm){
        const someperson = persons.find(person => person.name === newName)
        console.log(someperson.id)
        const updatedperson = {...someperson, number : newPhone}
        personService.update(someperson.id,updatedperson).then(response =>{
          setPersons(persons.map(person=> person.name === newName ? response : person))
        }

        ).then(()=>{
          setMessage("Number updated successfully!")
          setTimeout(()=>{setMessage(null)},5000)
        }
          
        )
      } else{
        console.log("cancelled update")
        return;
      }
      
    }

    const newPerson = {
      name: newName,
      number: newPhone
    }

    personService.create(newPerson).then(response=>{
      setPersons(persons.concat(response))
    }).then( ()=>{
      setMessage("Person created successfully!")
      setTimeout(()=>{setMessage(null)},5000)
    }
      
    )

    
    setNewName('')
    setNewPhone('')

  }

  const [search, setSearch] = useState('')
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [message, setMessage] = useState('')

  const handleSearch = (event) =>{
    setSearch(event.target.value)
  }

  const filteredPersons = persons.filter(person=>person.name.toLowerCase().startsWith(search.toLowerCase()))

  const addNewName = (event) =>{
    
    setNewName(event.target.value)
  }

  const addNewPhone = (event) =>{
    setNewPhone(event.target.value)
  } 

  const deletePerson = (delperson) =>{

    const confirmation = window.confirm(`Are you sure you want to delete ${delperson.name}?`)

    if(confirmation){

      personService.del(delperson.id)
    setPersons(persons.filter(person=>person.id !== delperson.id))
    setMessage("Person deleted successfully!")
    setTimeout(()=>{setMessage(null)},5000)

    } else{
      console.log("Deletion Cancelled")
    }
    
    
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} />
     
      <Filter value = {search} onChange = {handleSearch} />
      <PersonForm onSubmit = {addPerson} nameValue = {newName} phoneValue = {newPhone} onNameChange = {addNewName} onPhoneChange = {addNewPhone} />
      
      <h2>Numbers</h2>
      <FilteredPersons persons = {filteredPersons} delete = {deletePerson}/>
      ...
    </div>
  )
}

export default App