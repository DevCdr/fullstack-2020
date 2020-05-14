describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.createUser({ username: 'testuser', password: 'testpw', name: 'Joe Bloggs' })
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('testpw')
      cy.get('#login-button').click()

      cy.contains('Joe Bloggs logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('test')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'Joe Bloggs logged in')
    })

    describe('When logged in', function() {
      beforeEach(function() {
        cy.login({ username: 'testuser', password: 'testpw' })
      })

      it('A blog can be created', function() {
        cy.contains('create new blog').click()

        cy.get('#title').type('Test title')
        cy.get('#author').type('Test author')
        cy.get('#url').type('Test url')
        cy.get('#submit-button').click()

        cy.contains('Test title Test author')
      })

      describe('and a blog exists', function () {
        beforeEach(function () {
          cy.createBlog({
            title: 'Test title',
            author: 'Test author',
            url: 'Test url',
            likes: 1
          })
        })

        it('it can be made liked', function () {
          cy.contains('view').click()
          cy.contains('like').click()
          cy.contains('likes 2')
        })

        it('it can be made removed', function () {
          cy.contains('view').click()
          cy.contains('remove').click()

          cy.get('.notice')
            .should('contain', 'blog Test title by Test author removed')
            .and('have.css', 'color', 'rgb(0, 128, 0)')

          cy.get('html').should('not.contain', 'Test title Test author')
        })

        it('it cannot be removed by unauthorized user', function () {
          cy.contains('logout').click()
          cy.createUser({ username: 'testuser2', password: 'testpw', name: 'John Smith' })
          cy.login({ username: 'testuser2', password: 'testpw' })

          cy.contains('view').click()

          cy.get('html').should('not.contain', 'remove')
        })

        describe('several blogs exist', function () {
          beforeEach(function () {
            cy.createBlog({
              title: 'Another test title',
              author: 'Another random author',
              url: 'Test url',
              likes: 5
            })

            cy.createBlog({
              title: 'Third title',
              author: 'Third random author',
              url: 'Test url',
              likes: 3
            })
          })

          it('blogs are sorted according to their likes', function () {
            cy.contains('Test title').contains('view').click()
            cy.contains('Another test title').contains('view').click()
            cy.contains('Third title').contains('view').click()

            cy.get('.togglableContent').then(content => {
              cy.wrap(content[0]).contains('likes 5')
              cy.wrap(content[1]).contains('likes 3')
              cy.wrap(content[2]).contains('likes 1')
            })
          })
        })
      })
    })
  })
})