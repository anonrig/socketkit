/// <reference types="cypress" />

const user = require('../../fixtures/valid_user.json')

context('Settings > Account Settings', () => {
  before(() => {
    cy.login(user)
  })

  beforeEach(() => Cypress.Cookies.preserveOnce('ory_kratos_session'))

  it('should redirect to stripe', () => {
    cy.visit('https://web.socketkit.com/account/users')
    cy.get('[href="https://core.socketkit.com/v1/payments/portal"]').click()
    cy.url().should('contain', 'stripe.com')
  })
})
