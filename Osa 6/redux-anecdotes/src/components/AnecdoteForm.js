import React from 'react'
import { connect } from 'react-redux'
import { addItem } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    props.addItem(content)
    props.setNotification(`new anecdote '${content}'`, 5)
  }

  return (
    <form onSubmit={addAnecdote}>
      <div><input name="anecdote"/></div>
      <button type="submit">create</button>
    </form>
  )
}

export default connect(null, { addItem, setNotification })(AnecdoteForm)