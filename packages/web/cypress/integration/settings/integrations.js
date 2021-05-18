/// <reference types="cypress" />

const user = require('../../fixtures/valid_user.json')

context('Settings > Integrations', () => {
  before(() => {
    cy.login(user)
  })

  beforeEach(() => Cypress.Cookies.preserveOnce('ory_kratos_session'))

  it('should update review tracking preferences', () => {
    cy.visit('https://web.socketkit.com/account/integrations')
    cy.get(':nth-child(2) > .ml-4 > .inline-flex').click()
    cy.url().should('contain', 'account/integrations/reviews')
    cy.get('button.bg-orange-500[type="button"]').click()
    cy.url().should('contain', 'account/integrations')
  })
})
