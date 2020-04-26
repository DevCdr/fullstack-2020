import React, {useState, useEffect} from 'react'
import nameService from './services/names'
import './index.css'

const Notification = ({message, type}) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}

const Filter = ({filter, setFilter}) => {
  const handleFilterChange = (event) => setFilter(event.target.value)

  return (
    <div>
      filter shown with <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = ({persons, setPersons, name, setName, number, setNumber, setMessage, setType}) => {
  const addName = (event) => {
    event.preventDefault()

    const nameObject = {
      name: name,
      number: number
    }

    const person = persons.find(n => n.name.toLowerCase() === name.toLowerCase())
    person === undefined
      ? AddID(nameObject, persons, setPersons, setName, setNumber, setMessage, setType)
      : ReplaceID(nameObject, person, persons, setPersons, setName, setNumber, setMessage, setType)
  }

  const handleNameChange = (event) => setName(event.target.value)
  const handleNumberChange = (event) => setNumber(event.target.value)

  return (
    <form onSubmit={addName}>
      <div>
        name: <input value={name} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={number} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({persons, setPersons, filter, setMessage, setType}) => {
  const namesToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      {namesToShow.map((person, i) => <Name key={i} person={person} persons={persons} setPersons={setPersons} setMessage={setMessage} setType={setType} />)}
    </div>
  )
}

const Name = ({person, persons, setPersons, setMessage, setType}) => {
  return (
    <div>{person.name} {person.number} <button onClick={() => DeleteID(person, persons, setPersons, setMessage, setType)}>delete</button></div>
  )
}

function AddID(nameObject, persons, setPersons, setName, setNumber, setMessage, setType) {
  nameService
    .create(nameObject)
    .then(response => {
      setPersons(persons.concat(response))
      setName('')
      setNumber('')
      setMessage(`Added ${nameObject.name}`)
      setTimeout(() => {setMessage(null)}, 2000)
      setType('notice')
    })
    .catch(() => {
      setMessage(`Error adding ${nameObject.name}`)
      setTimeout(() => {setMessage(null)}, 2000)
      setType('error')
    })
}

function ReplaceID(nameObject, person, persons, setPersons, setName, setNumber, setMessage, setType) {
  if (window.confirm(`${nameObject.name} is already added to phonebook, replace the old number with a new one?`)) {
    nameService
    .update(person.id, nameObject)
    .then(response => {
      setPersons(persons.map(n => n.id !== person.id ? n : response))
      setName('')
      setNumber('')
      setMessage(`Updated ${nameObject.name}`)
      setTimeout(() => {setMessage(null)}, 2000)
      setType('notice')
    })
    .catch(() => {
      setPersons(persons.filter(n => n.id !== person.id))
      setMessage(`Information of ${nameObject.name} has already been removed from server`)
      setTimeout(() => {setMessage(null)}, 2000)
      setType('error')
    })
  }
}

function DeleteID(person, persons, setPersons, setMessage, setType) {
  if (window.confirm(`Delete ${person.name}?`)) {
    nameService
    .deleteID(person.id)
    .then(() => {
      setPersons(persons.filter(n => n.id !== person.id))
      setMessage(`Deleted ${person.name}`)
      setTimeout(() => {setMessage(null)}, 2000)
      setType('notice')
    })
    .catch(() => {
      setPersons(persons.filter(n => n.id !== person.id))
      setMessage(`Information of ${person.name} has already been removed from server`)
      setTimeout(() => {setMessage(null)}, 2000)
      setType('error')
    })
  }
}

const App = () => {
  const [newFilter, setNewFilter] = useState('')
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [message, setMessage] = useState(null)
  const [type, setType] = useState('')

  useEffect(() => {
    nameService
      .getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={type} />
      <Filter filter={newFilter} setFilter={setNewFilter} />
      <h3>Add a new</h3>
      <PersonForm persons={persons} setPersons={setPersons} name={newName} setName={setNewName} number={newNumber} setNumber={setNewNumber} setMessage={setMessage} setType={setType} />
      <h3>Numbers</h3>
      <Persons persons={persons} setPersons={setPersons} filter={newFilter} setMessage={setMessage} setType={setType} />
    </div>
  )
}

export default App