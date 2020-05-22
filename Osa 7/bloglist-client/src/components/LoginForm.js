import React from 'react'
import { useDispatch } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import { login } from '../reducers/loginReducer'
import { useField } from '../hooks'

const LoginForm = () => {
  const { reset: resetUsername, ...username } = useField('text', 'Username', 'username')
  const { reset: resetPassword, ...password } = useField('password', 'Password', 'password')

  const dispatch = useDispatch()

  const handleLogin = (event) => {
    event.preventDefault()

    dispatch(login({
      username: username.value,
      password: password.value
    }))

    resetUsername()
    resetPassword()
  }

  return (
    <Form onSubmit={handleLogin}>
      <Form.Group>
        <Form.Label>username</Form.Label>
        <Form.Control {...username} />
        <Form.Label>password</Form.Label>
        <Form.Control {...password} />
        <Button style={{ marginTop: 10 }} type="submit" id="login-button">login</Button>
      </Form.Group>
    </Form>
  )
}

export default LoginForm