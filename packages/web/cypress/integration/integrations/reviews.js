/// <reference types="cypress" />

const user = require('../../fixtures/valid_user.json')

context('Integrations > Reviews', () => {
  before(() => {
    cy.login(user)
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('ory_kratos_session')
    cy.visit('/account/integrations/reviews')
  })

  it('should redirect to integrations on submit', () => {
    cy.get('button.bg-orange-500[type="button"]:nth-child(1)').click()
    cy.location().should((loc) => expect(loc.pathname).to.eq('/account/integrations'))
  })

  it('should go back to integrations on cancel', () => {
    cy.get('#cancel').click()
    cy.location().should((loc) => expect(loc.pathname).to.eq('/account/integrations'))
  })
})
