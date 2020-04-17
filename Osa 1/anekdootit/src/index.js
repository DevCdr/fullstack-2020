import React, {useState} from 'react'
import ReactDOM from 'react-dom'

const Random = (size) => Math.floor(size * Math.random())

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

const App = (props) => {
  const [selected, setSelected] = useState(Random(props.anecdotes.length))
  const [vote, setVote] = useState(new Array(props.anecdotes.length + 1).join('0').split('').map(parseFloat))
  const copy = [...vote]
  copy[selected] += 1

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div>{props.anecdotes[selected]}</div>
      <div>has {vote[selected]} votes</div>
      <Button handleClick={() => setVote(copy)} text='vote' />
      <Button handleClick={() => setSelected(Random(props.anecdotes.length))} text='next anecdote' />
      <h1>Anecdote with most votes</h1>
      <div>{props.anecdotes[vote.indexOf(Math.max(...vote))]}</div>
      <div>has {vote[vote.indexOf(Math.max(...vote))]} votes</div>
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById('root'))