/* eslint-env cypress */

beforeEach(() => {
  cy.clearAllLocalStorage();
  cy.visit('/');
  cy.get('a').contains('Try the demo').click();
});

describe('routing', () => {
  it('load route list', () => {
    cy.visit('/1d3dc3e03047b0c7');
    cy.get('.DriveList').should('be.visible');
    cy.get('.DriveEntry').should('be.visible');
    cy.get('.DriveEntry').should('have.length.greaterThan', 0);
  });

  it('load route from URL', () => {
    cy.visit('/1d3dc3e03047b0c7/000000dd--455f14369d');
    cy.get('video').should('have.attr', 'src').and('match', /^blob:/);
  });
});
