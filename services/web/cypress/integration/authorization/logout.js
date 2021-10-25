/// <reference types="cypress" />

const user = require('../../fixtures/valid_user.json')

context('Login > Logout', () => {
  beforeEach(() => {
    cy.goToRoot()
  })

  it('should logout', () => {
    cy.get(`input[name='password_identifier']`).type(user.email).should('have.value', user.email)
    cy.get(`input[name='password']`).type(user.password).should('have.value', user.password)
    cy.get(`button[value='password']`).click()
    cy.url()
    cy.get('.space-between > .font-extrabold').should('contain', 'Test!')
    cy.get('nav button.rounded-full').click()
    cy.get(`div[role='menu'] > :nth-child(2) a`).click()
    cy.location().should((loc) => expect(loc.pathname).to.eq('/signin'))
  })
})
