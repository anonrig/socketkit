/// <reference types="cypress" />

const user = require('../../fixtures/valid_user.json')
const invalidUser = require('../../fixtures/invalid_user.json')

context('Login > Sign In', () => {
  beforeEach(() => {
    cy.visit('https://web.socketkit.com')
  })

  it('should focus to input on direct click to button', () => {
    cy.get(`button[value='password']`).click()
    cy.focused().should('have.attr', 'name', 'password_identifier')
  })

  it('should focus to password when value is missing', () => {
    cy.get(`input[name='password_identifier']`).type(invalidUser.email)
    cy.get(`button[value='password']`).click()
    cy.focused().should('have.attr', 'name', 'password')
  })

  it('should return error if credentials are invalid', () => {
    cy.get(`input[name='password_identifier']`)
      .type(invalidUser.email)
      .should('have.value', invalidUser.email)

    cy.get(`input[name='password']`)
      .type(invalidUser.password)
      .should('have.value', invalidUser.password)

    cy.get(`button[value='password']`).click()

    cy.url()

    cy.get('p.text-red-500').contains('The provided credentials are invalid')
  })

  it('should go to signup', () => {
    cy.get(`a.font-semibold.text-orange-500`).click()
    cy.url().should('contain', 'signup')
  })

  it('should go to recover account', () => {
    cy.get(`form > .flex.items-center > a`).click()
    cy.url().should('contain', 'recover-account')
  })

  it('should redirect to dashboard after signing in', () => {
    cy.get(`input[name='password_identifier']`).type(user.email)
    cy.get(`input[name='password']`).type(user.password)
    cy.get(`button[value='password']`).click()
    cy.url()
    cy.get('.space-between > .font-extrabold').should('contain', 'Test!')
  })

  it('should sign in using github', () => {
    cy.get(`button[name='provider']`).click()
    cy.url().should('contain', 'github.com')
  })
})
