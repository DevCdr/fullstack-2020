const blogModel = require('../models/blog')
const userModel = require('../models/user')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
]

const initialUsers = [
  {
    username: 'testuser',
    password: 'testpw',
    name: 'Joe Bloggs'
  }
]

const nonExistingId = async () => {
  const blog = new blogModel(initialBlogs[0])
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await blogModel.find()
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await userModel.find()
  return users.map(user => user.toJSON())
}

module.exports = { initialBlogs, initialUsers, nonExistingId, blogsInDb, usersInDb }