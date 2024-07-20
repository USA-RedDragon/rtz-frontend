/* eslint-env cypress */

describe('demo mode', () => {
  it('should load demo route', () => {
    cy.viewport(1600, 1200);
    cy.visit('/');
    cy.get('a').contains('Try the demo').click();
    cy.get('.DriveList').should('be.visible');
    cy.get('.DriveEntry').first().should('be.visible').click({force: true});
    cy.get('video').invoke('attr', 'src').should('match', /^blob:/);
  });
});
