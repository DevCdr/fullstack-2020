import anecdoteService from '../services/anecdotes'

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_VOTE':
      return state.map(anecdote => anecdote.id !== action.data.id ? anecdote : action.data)
    case 'ADD_ITEM':
      return state.concat(action.data)
    case 'INIT_ITEMS':
      return action.data
    default:
      return state
  }
}

export const addVote = (data) => (
  async dispatch => {
    const updatedAnecdote = await anecdoteService.vote(data)
    dispatch({
      type: 'ADD_VOTE',
      data: updatedAnecdote
    })
  }
)

export const addItem = (data) => (
  async dispatch => {
    const newAnecdote = await anecdoteService.createNew(data)
    dispatch({
      type: 'ADD_ITEM',
      data: newAnecdote
    })
  }
)

export const initializeAnecdotes = () => (
  async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ITEMS',
      data: anecdotes
    })
  }
)

export default reducer