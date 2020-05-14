import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let component

  const createBlog = jest.fn()

  beforeEach(() => {
    component = render(
      <BlogForm createBlog={createBlog} />
    )
  })

  test('the event handler is called with right info when form is submitted', () => {
    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')

    const form = component.container.querySelector('form')

    fireEvent.change(title, {
      target: { value: 'Test title' }
    })

    fireEvent.change(author, {
      target: { value: 'Test author' }
    })
    fireEvent.change(url, {
      target: { value: 'Test url' }
    })

    fireEvent.submit(form)

    expect(createBlog.mock.calls).toHaveLength(1)

    expect(createBlog.mock.calls[0][0].title).toBe('Test title')
    expect(createBlog.mock.calls[0][0].author).toBe('Test author')
    expect(createBlog.mock.calls[0][0].url).toBe('Test url')
  })
})