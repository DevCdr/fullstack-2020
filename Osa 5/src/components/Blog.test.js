import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component

  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'Test url',
    likes: 0,
    user: {
      username: 'testuser',
      name: 'Joe Bloggs',
      id: '123'
    },
    id: '123'
  }

  const user = {
    blogs: {
      title: 'Test title',
      author: 'Test author',
      url: 'Test url',
      id: '123'
    },
    username: 'testuser',
    name: 'Joe Bloggs',
    id: '123'
  }

  const updateBlog = jest.fn()
  const deleteBlog = jest.fn()

  beforeEach(() => {
    component = render(
      <Blog blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} user={user} />
    )
  })

  test('renders only title and author by default', () => {
    const div = component.container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('renders also url and likes when button is pressed', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.togglableContent')
    expect(div).toHaveStyle('')
  })

  test('clicking the like button twice calls the event handler two times', () => {
    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(updateBlog.mock.calls.length).toBe(2)
  })
})