import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const buttonStyle = {
    background: 'blue'
  }

  const toggleVisibility = () => setVisible(!visible)
  const label = visible ? 'hide' : 'view'
  const showWhenVisible = { display: visible ? '' : 'none' }

  const likeBlog = () => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id
    }

    updateBlog(blog.id, updatedBlog)
  }

  const RemoveBlog = () => {
    if (blog.user.username === user.username) {
      return (
        <button
          style={buttonStyle}
          onClick={() => window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
            ? deleteBlog(blog)
            : null
          }
        >remove</button>
      )
    }

    return null
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>{label}</button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        {blog.url}<br />
        likes {blog.likes} <button onClick={likeBlog}>like</button><br />
        {blog.user.name}<br />
        <RemoveBlog />
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog