/// <reference types="cypress" />

const user = require('../../fixtures/valid_user.json')

context('Settings > Integrations', () => {
  before(() => {
    cy.login(user)
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('ory_kratos_session')
    cy.visit('/account/integrations')
  })

  it('should go to appstore connect page', () => {
    cy.get('[href="/account/integrations/appstore-connect"]').click()
    cy.location().should((loc) =>
      expect(loc.pathname).to.eq('/account/integrations/appstore-connect'),
    )
  })

  it('should go to reviews', () => {
    cy.get('[href="/account/integrations/reviews"]').click()
    cy.location().should((loc) => expect(loc.pathname).to.eq('/account/integrations/reviews'))
  })
})
