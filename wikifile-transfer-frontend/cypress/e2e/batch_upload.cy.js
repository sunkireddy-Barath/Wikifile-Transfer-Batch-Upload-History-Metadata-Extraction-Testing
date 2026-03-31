describe('Batch Upload Page', () => {
  beforeEach(() => {
    // Mock the initial API call if needed, or assume mock mode is on
    cy.visit('/batch');
  });

  it('loads the batch upload page', () => {
    cy.get('h4').should('contain', 'Batch Upload');
  });

  it('adds file titles to the list', () => {
    cy.get('input[placeholder="Enter file title (e.g., File:Example.jpg)"]').first().type('File:Test1.jpg');
    cy.get('button').contains('Add File').click();
    cy.get('input[placeholder="Enter file title (e.g., File:Example.jpg)"]').eq(1).type('File:Test2.jpg');
  });

  it('fills shared metadata form', () => {
    cy.get('input[label="Description"]').type('Testing batch upload');
    cy.get('input[label="Author"]').type('Cypress Bot');
  });

  it('submits and shows progress table', () => {
    cy.get('input[placeholder="Enter file title (e.g., File:Example.jpg)"]').first().type('File:Test_Progress.jpg');
    cy.get('button').contains('Transfer All').click();
    
    cy.get('h4').should('contain', 'Transfer Progress');
    cy.get('table').should('be.visible');
    cy.get('table').find('tr').should('have.length.at.least', 2);
  });

  it('finishes polling and shows summary', () => {
    cy.get('input[placeholder="Enter file title (e.g., File:Example.jpg)"]').first().type('File:Complete_Me.jpg');
    cy.get('button').contains('Transfer All').click();
    
    // Wait for the mock to complete (it should take a few seconds)
    cy.get('h6', { timeout: 10000 }).should('contain', 'Full Summary');
    cy.get('button').contains('View History').should('be.visible');
  });
});
