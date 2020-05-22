const testingRouter = require('express').Router()
const blogModel = require('../models/blog')
const userModel = require('../models/user')

testingRouter.post('/reset', async (request, response) => {
  await blogModel.deleteMany({})
  await userModel.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter