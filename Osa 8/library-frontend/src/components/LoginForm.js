import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const [login, result] = useMutation(LOGIN, {
    onCompleted: () => {
      props.setPage('authors')
    },
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
      setTimeout(() => setError(null), 5000)
    }
  })

  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      props.setToken(token)
      localStorage.setItem('user-token', token)
    }
  }, [result.data, props])

  if (!props.show) {
    return null
  }

  const notification = () => {
    if (error) {
      return <div style={{ color: 'red' }}>{error}</div>
    }
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <div>
      {notification()}
      <form onSubmit={submit}>
        <div>
          username <input
            autoComplete="on"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            autoComplete="on"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm