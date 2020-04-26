import React from 'react'

const Course = ({course}) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const Header = ({course}) => {
  return (
    <div>
      <h1>{course}</h1>
    </div>
  )
}

const Content = ({parts}) => {
  return (
    <div>
      {parts.map(i => <Part key={i.id} part={i} />)}
    </div>
  )
}

const Part = ({part}) => {
  return (
    <div>
      <p>
        {part.name} {part.exercises}
      </p>
    </div>
  )
}

const Total = ({parts}) => {
  return (
    <div>
      <p><b>total of {parts.reduce((s, p) => s + p.exercises, 0)} exercises</b></p>
    </div>
  )
}

export default Course