describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.createUser({ username: 'testuser', password: 'testpw', name: 'Joe Bloggs' })
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to Application')
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

      cy.get('[class="fade alert alert-danger show"]')
        .should('contain', 'invalid username or password')

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
          cy.contains('Test title').click()
          cy.contains('like').click()
          cy.contains('2 likes')
        })

        it('it can be made removed', function () {
          cy.contains('Test title').click()
          cy.contains('remove').click()

          cy.get('[class="fade alert alert-success show"]')
            .should('contain', 'blog Test title by Test author removed')

          cy.get('html').should('not.contain', 'Test title Test author')
        })

        it('it cannot be removed by unauthorized user', function () {
          cy.contains('logout').click()
          cy.createUser({ username: 'testuser2', password: 'testpw', name: 'John Smith' })
          cy.login({ username: 'testuser2', password: 'testpw' })

          cy.contains('Test title').click()

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
            cy.get('a[href*="/blogs/"]').then(content => {
              content[0].click()
              cy.contains('5 likes')
              cy.go(-1)
            })
            cy.get('a[href*="/blogs/"]').then(content => {
              content[1].click()
              cy.contains('3 likes')
              cy.go(-1)
            })
            cy.get('a[href*="/blogs/"]').then(content => {
              content[2].click()
              cy.contains('1 likes')
            })
          })
        })
      })
    })
  })
})