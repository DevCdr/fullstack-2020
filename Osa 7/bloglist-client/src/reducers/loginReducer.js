import loginService from '../services/login'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const reducer = (state = null, action) => {
  switch (action.type) {
  case 'INIT_LOGIN':
    return action.data
  case 'LOGIN':
    return action.data
  case 'LOGOUT':
    return null
  default:
    return state
  }
}

export const initLogin = () => (
  async dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch({
        type: 'INIT_LOGIN',
        data: user
      })
    }
  }
)

export const login = (credentials) => (
  async dispatch => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch({
        type: 'LOGIN',
        data: user
      })
    }
    catch (exception) {
      dispatch(setNotification(exception.response.data.error, 'danger', 5))
    }
  }
)

export const logout = () => (
  async dispatch => {
    window.localStorage.removeItem('loggedUser')
    blogService.setToken(null)
    dispatch({
      type: 'LOGOUT'
    })
  }
)

export default reducer