import React from 'react'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import { addLike, deleteItem, addComment } from '../reducers/blogReducer'
import { useField } from '../hooks'

const Blog = () => {
  const { reset: resetComment, ...comment } = useField('text', 'Comment', 'comment')

  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.login)
  const dispatch = useDispatch()

  const history = useHistory()

  const match = useRouteMatch('/blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  const buttonStyle = {
    background: 'blue'
  }

  const likeBlog = () => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
      comments: blog.comments.map(comment => comment.id)
    }

    dispatch(addLike(blog.id, updatedBlog))
  }

  const removeBlog = () => {
    if (blog.user.username === user.username) {
      return (
        <button
          style={buttonStyle}
          onClick={() => window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
            ? (dispatch(deleteItem(blog)), history.push('/'))
            : null
          }
        >remove</button>
      )
    }

    return null
  }

  const commentBlog = (event) => {
    event.preventDefault()

    dispatch(addComment(blog.id, {
      comment: comment.value
    }))

    resetComment()
  }

  if (!blog) {
    return null
  }

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <a href={blog.url}>{blog.url}</a><br />
      {blog.likes} likes <button onClick={likeBlog}>like</button><br />
      added by {blog.user.name}<br />
      {removeBlog()}
      <br /><br />
      <h3>comments</h3>
      <form onSubmit={commentBlog}>
        <div>
          <Form.Group>
            <Form.Control {...comment} />
            <Button style={{ marginTop: 10 }} type="submit" id="submit-button">create</Button>
          </Form.Group>
        </div>
      </form>
      <ul>
        {blog.comments.map(comment => <li key={comment.id}>{comment.comment}</li>)}
      </ul>
    </div>
  )
}

export default Blog