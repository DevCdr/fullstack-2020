import userService from '../services/users'

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_USERS':
    return action.data
  case 'UPDATE_USER':
    return state.map(user => user.id !== action.data.id ? user : action.data)
  default:
    return state
  }
}

export const initUsers = () => (
  async dispatch => {
    const users = await userService.getAll()
    dispatch({
      type: 'INIT_USERS',
      data: users
    })
  }
)

export const updateUser = (data) => ({
  type: 'UPDATE_USER',
  data
})

export default reducer