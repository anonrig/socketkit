/// <reference types="cypress" />
const { v4 } = require('uuid')

context('Login > Sign up', () => {
  beforeEach(() => {
    cy.visit('https://web.socketkit.com/signup')
  })

  it('should focus to input on direct click to button', () => {
    cy.get(`button[name='method']`).click()
    cy.focused().should('have.attr', 'name', 'password')
  })

  it('should create an account', () => {
    cy.get(`input[name='traits.name']`)
      .type('Socketkit Test Account')
      .should('have.value', 'Socketkit Test Account')

    cy.get(`input[name='traits.email']`)
      .type('hello@socketkit.com')
      .should('have.value', 'hello@socketkit.com')

    cy.get(`input[type='password']`).type('1234567890').should('have.value', '1234567890')
    cy.get(`button[name='method']`).click()
    cy.get(`input[type='password']`).should(($div) =>
      expect($div[0].className).to.contain('border-red-500'),
    )

    cy.get('p.text-red-500').contains('The password can not be used')

    cy.get(`input[type='password']`).type(v4())
    cy.get(`button[name='method']`).click()

    cy.get('p.text-red-500').contains('An account with the same identifier')
  })

  it('should go back to login', () => {
    cy.get(`form > a`).click()
    cy.location().should((loc) => expect(loc.pathname).to.eq('/signin'))
  })
})
