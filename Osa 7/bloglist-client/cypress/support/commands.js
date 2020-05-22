Cypress.Commands.add('createUser', ({ username, password, name }) => {
  cy.request('POST', 'http://localhost:3001/api/users', { username, password, name })
})

Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', { username, password })
    .then(({ body }) => {
      localStorage.setItem('loggedUser', JSON.stringify(body))
      cy.visit('http://localhost:3000')
    })
})

Cypress.Commands.add('createBlog', ({ title, author, url, likes }) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3001/api/blogs',
    body: { title, author, url, likes },
    headers: { Authorization: `bearer ${JSON.parse(localStorage.getItem('loggedUser')).token}` }
  })
    .then(() => cy.visit('http://localhost:3000'))
})