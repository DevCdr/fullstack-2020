const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const blogModel = require('../models/blog')
const userModel = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await blogModel.find().populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await userModel.findById(decodedToken.id)

  const blog = new blogModel({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await blogModel.findById(request.params.id)
  const user = await userModel.findById(decodedToken.id)

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'action denied' })
  }

  await blogModel.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = await blogModel.findById(request.params.id)

  const newBlog = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: body.likes === blog.likes + 1 ? blog.likes + 1 : blog.likes
  }

  const updatedBlog = await blogModel.findByIdAndUpdate(request.params.id, newBlog, { new: true })
  response.json(updatedBlog.toJSON())
})

module.exports = blogsRouter