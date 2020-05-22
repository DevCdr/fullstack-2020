import React, { useEffect } from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Nav, Navbar } from 'react-bootstrap'

import { initBlogs } from './reducers/blogReducer'
import { initUsers } from './reducers/userReducer'
import { initLogin, logout } from './reducers/loginReducer'

import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Users from './components/Users'
import User from './components/User'

const blogFormRef = React.createRef()

const App = () => {
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.login)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initBlogs())
    dispatch(initUsers())
    dispatch(initLogin())
  }, [dispatch])

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const menu = () => (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#" as="span">
            <Link to="/">blogs</Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <Link to="/users">users</Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <em>{user.name} logged in</em> - <strong><Link to="#" onClick={() => dispatch(logout())}>logout</Link></strong>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )

  const blogForm = () => (
    <Togglable buttonLabel='create new blog' ref={ blogFormRef }>
      <BlogForm blogFormRef={blogFormRef} />
    </Togglable>
  )

  if (user === null) {
    return (
      <div className="container">
        <h2 style={{ marginTop: 20, marginBottom: 40 }}>Log in to Application</h2>
        <Notification />
        <LoginForm />
      </div>
    )
  }

  return (
    <div className="container">
      {menu()}
      <h2 style={{ marginTop: 20, marginBottom: 40 }}>Blog App</h2>
      <Notification />
      <Switch>
        <Route path="/users/:id">
          <User />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/blogs/:id">
          <Blog />
        </Route>
        <Route path="/">
          {blogForm()}
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map(blog => (
              <div key={blog.id} style={blogStyle}>
                <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
              </div>
            ))}
        </Route>
      </Switch>
    </div>
  )
}

export default App