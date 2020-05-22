const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => sum + item.likes, 0)
}

const favoriteBlog = (blogs) => {
  const index = blogs.map(blog => blog.likes).indexOf(Math.max(...blogs.map(blog => blog.likes)))

  return index === -1 ? {} : {
    title: blogs[index].title,
    author: blogs[index].author,
    likes: blogs[index].likes
  }
}

const mostBlogs = (blogs) => {
  const authorCount = _.countBy(blogs.map(blog => blog.author))
  const mostBlogs = Math.max(...Object.values(authorCount))

  return blogs.length === 0 ? {} : {
    author: Object.keys(authorCount)[Object.values(authorCount).indexOf(mostBlogs)],
    blogs: mostBlogs
  }
}

const mostLikes = (blogs) => {
  const authors = Object.keys(_.groupBy(blogs, 'author'))
  const data = Object.values(_.groupBy(blogs, 'author'))

  const sums = data.reduce((s, i) => s.concat(i.reduce((s, i) => s + i.likes, 0)), [])

  return blogs.length === 0 ? {} : {
    author: authors[sums.indexOf(Math.max(...sums))],
    likes: Math.max(...sums)
  }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }