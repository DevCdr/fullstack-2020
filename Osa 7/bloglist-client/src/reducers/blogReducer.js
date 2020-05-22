import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'
import { updateUser } from './userReducer'

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_ITEMS':
    return action.data
  case 'ADD_ITEM':
    return state.concat(action.data)
  case 'ADD_LIKE':
    return state.map(blog => blog.id !== action.data.id ? blog : action.data)
  case 'DELETE_ITEM':
    return state.filter(blog => blog.id !== action.id)
  case 'ADD_COMMENT':
    return state.map(blog => blog.id !== action.data.id ? blog : action.data)
  default:
    return state
  }
}

export const initBlogs = () => (
  async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_ITEMS',
      data: blogs
    })
  }
)

export const addItem = (data) => (
  async dispatch => {
    try {
      const newData = await blogService.create(data)
      dispatch(setNotification(`a new blog ${newData.blog.title} by ${newData.blog.author} added`, 'success', 5))
      dispatch(updateUser(newData.user))
      dispatch({
        type: 'ADD_ITEM',
        data: newData.blog
      })
    }
    catch (exception) {
      dispatch(setNotification(exception.response.data.error, 'danger', 5))
    }
  }
)

export const addLike = (id, data) => (
  async dispatch => {
    try {
      const updatedBlog = await blogService.update(id, data)
      dispatch({
        type: 'ADD_LIKE',
        data: updatedBlog
      })
    }
    catch (exception) {
      dispatch(setNotification(exception.response.data.error, 'danger', 5))
    }
  }
)

export const deleteItem = (data) => (
  async dispatch => {
    try {
      await blogService.deleteID(data.id)
      dispatch(setNotification(`blog ${data.title} by ${data.author} removed`, 'success', 5))
      dispatch({
        type: 'DELETE_ITEM',
        id: data.id
      })
    }
    catch (exception) {
      dispatch(setNotification(exception.response.data.error, 'danger', 5))
    }
  }
)

export const addComment = (id, data) => (
  async dispatch => {
    try {
      const updatedBlog = await blogService.createComment(id, data)
      dispatch({
        type: 'ADD_COMMENT',
        data: updatedBlog
      })
    }
    catch (exception) {
      dispatch(setNotification(exception.response.data.error, 'danger', 5))
    }
  }
)

export default reducer