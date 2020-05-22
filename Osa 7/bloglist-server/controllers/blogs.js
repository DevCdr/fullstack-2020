const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const blogModel = require('../models/blog')
const commentModel = require('../models/comment')
const userModel = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await blogModel.find()
    .populate('user', { username: 1, name: 1 }).populate('comments', { comment: 1 })
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
  await savedBlog.populate('user', { username: 1, name: 1 }).execPopulate()

  user.blogs = user.blogs.concat(savedBlog._id)
  const updatedUser = await user.save()
  await updatedUser.populate('blogs', { title: 1, author: 1, url: 1 }).execPopulate()

  response.status(201).json({ blog: savedBlog.toJSON(), user: updatedUser.toJSON() })
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await blogModel.findById(request.params.id)

  const comment = new commentModel({
    comment: body.comment,
    blog: blog._id
  })

  const savedComment = await comment.save()

  blog.comments = blog.comments.concat(savedComment._id)
  const updatedBlog = await blog.save()

  await updatedBlog
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { comment: 1 })
    .execPopulate()

  response.status(201).json(updatedBlog.toJSON())
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
  await commentModel.deleteMany({ blog: request.params.id })
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user,
    comments: body.comments
  }

  const updatedBlog = await blogModel
    .findByIdAndUpdate(request.params.id, newBlog, { new: true })
    .populate('user', { username: 1, name: 1 }).populate('comments', { comment: 1 })

  response.json(updatedBlog.toJSON())
})

module.exports = blogsRouter