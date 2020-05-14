import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const blogFormRef = React.createRef()

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [type, setType] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const login = async (credentials) => {
    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
    }
    catch (exception) {
      setMessage(exception.response.data.error)
      setType('error')
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    blogService.setToken(null)
  }

  const loginForm = () => (
    <LoginForm login={login} />
  )

  const createBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))

      setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setType('notice')
      setTimeout(() => setMessage(null), 5000)
    }
    catch (exception) {
      setMessage(exception.response.data.error)
      setType('error')
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const updateBlog = async (id, blogObject) => {
    try {
      const returnedBlog = await blogService.update(id, blogObject)
      setBlogs(blogs.map(n => n.id !== returnedBlog.id ? n : returnedBlog))
    }
    catch (exception) {
      setMessage(exception.response.data.error)
      setType('error')
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const deleteBlog = async (blog) => {
    try {
      await blogService.deleteID(blog.id)
      setBlogs(blogs.filter(n => n.id !== blog.id))

      setMessage(`blog ${blog.title} by ${blog.author} removed`)
      setType('notice')
      setTimeout(() => setMessage(null), 5000)
    }
    catch (exception) {
      setMessage(exception.response.data.error)
      setType('error')
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel='create new blog' ref={ blogFormRef }>
      <BlogForm createBlog={createBlog} />
    </Togglable>
  )

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={message} type={type} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} type={type} />
      <p>{user.name} logged in <button onClick={() => logout()}>logout</button></p>
      {blogForm()}
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog => <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} user={user} />)}
    </div>
  )
}

export default App