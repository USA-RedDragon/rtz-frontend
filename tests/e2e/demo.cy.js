/* eslint-env cypress */

describe('demo mode', () => {
  it('should load demo route', () => {
    cy.visit('/');
    cy.get('a').contains('Try the demo').click();
    cy.get('.DriveList').should('be.visible');
    cy.get('.DriveEntry').should('be.visible').first().click();
    cy.get('video').invoke('attr', 'src').should('match', /^blob:/);
  });
});
