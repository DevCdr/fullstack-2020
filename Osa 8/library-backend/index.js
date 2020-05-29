const { ApolloServer, PubSub, UserInputError, AuthenticationError, gql } = require('apollo-server')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const DataLoader = require('dataloader')
const _ = require('lodash')
require('dotenv').config()
const authorModel = require('./models/author')
const bookModel = require('./models/book')
const userModel = require('./models/user')

const pubsub = new PubSub()

mongoose.set('useCreateIndex', true)

console.log('connecting to', process.env.MONGODB_URI)

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => console.log('error connecting to MongoDB:', error.message))

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }
  
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(
      author: String
      genre: String
    ): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`

const resolvers = {
  Query: {
    bookCount: () => bookModel.collection.countDocuments(),
    authorCount: () => authorModel.collection.countDocuments(),
    allBooks: async (root, args) => args.author && !args.genre
      ? bookModel.find({ author: await authorModel.findOne({ name: args.author }) }).populate('author')
      : !args.author && args.genre
        ? bookModel.find({ genres: args.genre }).populate('author')
        : args.author && args.genre
          ? bookModel.find({ author: await authorModel.findOne({ name: args.author }), genres: args.genre }).populate('author')
          : bookModel.find().populate('author'),
    allAuthors: () => authorModel.find(),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: (root, args, context) => context.bookCountLoader.load(root._id)
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      try {
        let author = await authorModel.findOne({ name: args.author })
        if (!author) {
          author = new authorModel({ name: args.author })
          await author.save()
        }
        const book = new bookModel({ ...args, author })
        pubsub.publish('BOOK_ADDED', { bookAdded: book })
        return book.save()
      }
      catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args })
      }
    },
    editAuthor: (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      if (!authorModel.findOne({ name: args.name })) {
        return null
      }
      return authorModel.findOneAndUpdate({ name: args.name }, { born: args.setBornTo })
    },
    createUser: (root, args) => {
      const user = new userModel({ ...args })
      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, { invalidArgs: args })
        })
    },
    login: async (root, args) => {
      const user = await userModel.findOne({ username: args.username })
      if ( !user || args.password !== 'secret' ) {
        throw new UserInputError('wrong credentials', { invalidArgs: args.password })
      }
      const userForToken = {
        username: user.username,
        id: user._id
      }
      return { value: jwt.sign(userForToken, process.env.SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const bookCountLoader = new DataLoader(authorIds => {
      return bookModel.find({ author: { $in: authorIds } }).then(books => {
        const booksByAuthor = _.groupBy(books, 'author')
        return authorIds.map(authorId => booksByAuthor[authorId].length)
      })
    })
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET)
      const currentUser = await userModel.findById(decodedToken.id)
      return { bookCountLoader, currentUser }
    }
    return { bookCountLoader }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})