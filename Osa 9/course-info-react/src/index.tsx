import React from "react";
import ReactDOM from "react-dom";

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartWithDescription extends CoursePartBase {
  description: string;
}

interface CoursePartOne extends CoursePartWithDescription {
  name: "Fundamentals";
}

interface CoursePartTwo extends CoursePartBase {
  name: "Using props to pass data";
  groupProjectCount: number;
}

interface CoursePartThree extends CoursePartWithDescription {
  name: "Deeper type usage";
  exerciseSubmissionLink: string;
}

interface CoursePartFour extends CoursePartWithDescription {
  name: "React with types";
}

type CoursePart = CoursePartOne | CoursePartTwo | CoursePartThree | CoursePartFour;

const Header: React.FC<{ name: string }> = ({ name }) => (
  <h1>{name}</h1>
)

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const Part: React.FC<{ part: CoursePart }> = ({ part }) => {
  switch (part.name) {
    case "Fundamentals":
      return (
        <div>
          <p>
            <strong>Name</strong> {part.name}<br />
            <strong>Exercise Count</strong> {part.exerciseCount}<br />
            <strong>Description</strong> {part.description}
          </p>
        </div>
      )
    case "Using props to pass data":
      return (
        <div>
          <p>
            <strong>Name</strong> {part.name}<br />
            <strong>Exercise Count</strong> {part.exerciseCount}<br />
            <strong>Group Project Count</strong> {part.groupProjectCount}
          </p>
        </div>
      )
    case "Deeper type usage":
      return (
        <div>
          <p>
            <strong>Name</strong> {part.name}<br />
            <strong>Exercise Count</strong> {part.exerciseCount}<br />
            <strong>Description</strong> {part.description}<br />
            <strong>Exercise Submission Link</strong> {part.exerciseSubmissionLink}
          </p>
        </div>
      )
    case "React with types":
      return (
        <div>
          <p>
            <strong>Name</strong> {part.name}<br />
            <strong>Exercise Count</strong> {part.exerciseCount}<br />
            <strong>Description</strong> {part.description}
          </p>
        </div>
      )
    default:
      return assertNever(part);
  }
}

const Content: React.FC<{ parts: CoursePart[] }> = ({ parts }) => (
  <div>
    {parts.map(part => <Part key={part.name} part={part} />)}
  </div>
)

const Total: React.FC<{ parts: CoursePart[] }> = ({ parts }) => (
  <p>
    <strong>Number of exercises</strong>{" "}
    {parts.reduce((carry, part) => carry + part.exerciseCount, 0)}
  </p>
)

const App: React.FC = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev"
    },
    {
      name: "React with types",
      exerciseCount: 27,
      description: "This is the last part"
    }
  ];

  return (
    <div>
      <Header name={courseName} />
      <Content parts={courseParts} />
      <Total parts={courseParts} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));