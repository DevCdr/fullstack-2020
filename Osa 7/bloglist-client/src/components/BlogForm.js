import React from 'react'
import { useDispatch } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { addItem } from '../reducers/blogReducer'
import { useField } from '../hooks'

const BlogForm = ({ blogFormRef }) => {
  const { reset: resetTitle, ...title } = useField('text', 'Title', 'title')
  const { reset: resetAuthor, ...author } = useField('text', 'Author', 'author')
  const { reset: resetUrl, ...url } = useField('text', 'Url', 'url')

  const dispatch = useDispatch()

  const addBlog = (event) => {
    event.preventDefault()
    blogFormRef.current.toggleVisibility()

    dispatch(addItem({
      title: title.value,
      author: author.value,
      url: url.value
    }))

    resetTitle()
    resetAuthor()
    resetUrl()
  }

  return (
    <Form onSubmit={addBlog}>
      <Form.Group>
        <Form.Label>title:</Form.Label>
        <Form.Control {...title} />
        <Form.Label>author:</Form.Label>
        <Form.Control {...author} />
        <Form.Label>url:</Form.Label>
        <Form.Control {...url} />
        <Button style={{ marginTop: 10, marginRight: 5 }} type="submit" id="submit-button">create</Button>
        <Button style={{ marginTop: 10 }} onClick={() => blogFormRef.current.toggleVisibility()}>cancel</Button>
      </Form.Group>
    </Form>
  )
}

BlogForm.propTypes = {
  blogFormRef: PropTypes.object.isRequired
}

export default BlogForm