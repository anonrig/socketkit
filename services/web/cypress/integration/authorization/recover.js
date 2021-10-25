/// <reference types="cypress" />

context('Login > Recover', () => {
  beforeEach(() => {
    cy.visit('/recover-account')
  })

  it('should focus to input on direct click to button', () => {
    cy.get(`button[value='link']`).click()
    cy.focused().should('have.attr', 'name', 'email')
  })

  it('should recover account', () => {
    cy.get(`form[method='POST'] > .flex.items-center > a`).click()
    cy.url().should('include', 'recover-account')
    cy.get(`input[name='email']`).type('hello@world.com').should('have.value', 'hello@world.com')
    cy.get(`button[value='link']`).click()
    cy.url().should((f) => expect(f).to.not.contain('failed'))
  })

  it('should go back to login', () => {
    cy.get(`form > a`).click()
    cy.location().should((loc) => expect(loc.pathname).to.eq('/signin'))
  })
})
