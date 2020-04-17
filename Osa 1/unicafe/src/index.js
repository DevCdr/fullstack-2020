import React, {useState} from 'react'
import ReactDOM from 'react-dom'

const Header = ({heading}) => <h1>{heading}</h1>

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

const StatisticLine = ({text, value}) => {
  if (text === 'positive') {
    return (
      <tr>
        <td>{text}</td>
        <td>{value} %</td>
      </tr>
    )
  }

  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({grade}) => {
  const {good, neutral, bad} = grade

  if (good === 0 && neutral === 0 && bad === 0) {
    return(
      <div>No feedback given</div>
    )
  }

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={good + neutral + bad} />
        <StatisticLine text="average" value={(good - bad) / (good + neutral + bad)} />
        <StatisticLine text="positive" value={good / (good + neutral + bad) * 100} />
      </tbody>
    </table>
  )
}

const App = () => {
  const [grade, setGrade] = useState({good: 0, neutral: 0, bad: 0})

  return (
    <div>
      <Header heading='give feedback' />

      <Button handleClick={() => setGrade({...grade, good: grade.good + 1})} text='good' />
      <Button handleClick={() => setGrade({...grade, neutral: grade.neutral + 1})} text='neutral' />
      <Button handleClick={() => setGrade({...grade, bad: grade.bad + 1})} text='bad' />

      <Header heading='statistics' />
      <Statistics grade={grade} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))