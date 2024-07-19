/* eslint-env cypress */

const DEMO_DEVICE_URL = '/1d3dc3e03047b0c7';
const DEMO_ROUTE_URL = '/1d3dc3e03047b0c7/000000dd--455f14369d';
const ZOOMED_DEMO_URL = '/1d3dc3e03047b0c7/000000dd--455f14369d/109/423';

beforeEach(() => {
  cy.visit('/');
  cy.get('a').contains('Try the demo').click();
});

describe('drive view', () => {
  it('back button disabled when in route bounds', () => {
    cy.visit(DEMO_ROUTE_URL);
    cy.get('.DriveView').should('be.visible');
    cy.get('.DriveView button[aria-label="Go Back"]').invoke('attr', 'disabled').should('be.true');
  });

  it('back button selects route bounds if timeline is zoomed when clicked', () => {
    cy.visit(ZOOMED_DEMO_URL);
    cy.get('.DriveView').should('be.visible');
    cy.get('.DriveView button[aria-label="Go Back"]').invoke('attr', 'disabled').should('be.false');
    cy.get('.DriveView button[aria-label="Go Back"]').click();
    cy.url().should('include', DEMO_ROUTE_URL);
  });

  it('close button navigates to drive list when clicked', () => {
    cy.visit(DEMO_ROUTE_URL);
    cy.get('.DriveView').should('be.visible');
    cy.get('.DriveView a[aria-label="Close"]').click();
    cy.url().should('include', DEMO_DEVICE_URL);
  });
});
