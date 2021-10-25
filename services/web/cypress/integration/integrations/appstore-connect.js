/// <reference types="cypress" />

const { v4 } = require('uuid')
const user = require('../../fixtures/valid_user.json')

context('Integrations > AppStore', () => {
  before(() => {
    cy.login(user)
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('ory_kratos_session')
    cy.visit('/account/integrations/appstore-connect')
  })

  it('should throw error on invalid appstore token', () => {
    const token = v4()
    cy.get('button[type="submit"]').click()
    cy.get('input[name="access_token"]').focused()
    cy.get('input[name="access_token"]').type(token).should('have.value', token)
    cy.get('button[type="submit"]').click()
    cy.get('.pointer-events-auto').should('contain', 'Token validation failed')
    cy.get('.space-x-4 :nth-child(1)').click()
    cy.location().should((loc) => expect(loc.pathname).to.eq('/account/integrations'))
  })
})
