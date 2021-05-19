/// <reference types="cypress" />

const { v4 } = require('uuid')
const user = require('../../fixtures/valid_user.json')

context('Settings > Integrations', () => {
  before(() => {
    cy.login(user)
  })

  beforeEach(() => Cypress.Cookies.preserveOnce('ory_kratos_session'))

  it('should redirect to integrations on submit', () => {
    cy.visit('/account/integrations/reviews')
    cy.get('button.bg-orange-500[type="button"]').click()
    cy.location().should((loc) => expect(loc.pathname).to.eq('/account/integrations'))
  })

  it('should go back to integrations on cancel', () => {
    cy.visit('/account/integrations/reviews')
    cy.get('.space-x-4 :nth-child(1)').click()
    cy.location().should((loc) => expect(loc.pathname).to.eq('/account/integrations'))
  })
})
