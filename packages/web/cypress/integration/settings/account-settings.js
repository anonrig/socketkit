/// <reference types="cypress" />

const { v4 } = require('uuid')
const user = require('../../fixtures/valid_user.json')

context('Settings > Account Settings', () => {
  before(() => {
    cy.login(user)
  })

  beforeEach(() => Cypress.Cookies.preserveOnce('ory_kratos_session'))

  it('should update profile information', () => {
    cy.visit('https://web.socketkit.com/account/settings')

    const name = v4()

    cy.get('input[name="traits.email"]').should('have.value', user.email)
    cy.get('input[name="traits.name"]').should('have.value', user.name)
    cy.get('button[value="profile"]').click()
    cy.url().should('contain', 'account/settings')

    cy.get('input[name="traits.name"]').clear().type(name).should('have.value', name)
    cy.get('button[value="profile"]').click()
    cy.get('input[name="traits.name"]').should('have.value', name)

    cy.get('input[name="traits.name"]').clear().type(user.name).should('have.value', user.name)
    cy.get('button[value="profile"]').click()
  })

  it('should update password', () => {
    cy.visit('https://web.socketkit.com/account/settings')
    cy.get('input[name="password"]').type(user.password).should('have.value', user.password)
    cy.get('button[value="password"]').click()
    cy.url().should('contain', 'account/settings')
  })
})
