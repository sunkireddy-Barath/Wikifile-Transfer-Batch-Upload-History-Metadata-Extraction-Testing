describe('History Dashboard', () => {
  beforeEach(() => {
    cy.visit('/history');
  });

  it('loads history page and stats', () => {
    cy.get('h4').should('contain', 'Upload History');
    cy.get('h5').should('contain', '142'); // Total transfers (mock)
    cy.get('h5').should('contain', '87.3%'); // Success rate (mock)
  });

  it('filters by Failed status tab', () => {
    cy.get('button[role="tab"]').contains('Failed').click();
    cy.get('button[role="tab"]').contains('Failed').should('have.class', 'Mui-selected');
  });

  it('retries a failed transfer', () => {
    // Look for a failed row and click retry
    cy.get('tr').contains('failed').parents('tr').within(() => {
      cy.get('button').contains('Retry').click();
    });
    
    // Note: in mock mode, it just returns 202 and we refresh.
    // In real app, the row status might change.
    cy.log('Retry confirmed');
  });

  it('navigates through pagination', () => {
    cy.get('.MuiTablePagination-root').should('be.visible');
    // For now mocking 42 records with 25 per page, should have page 2 button
    cy.get('[aria-label="go to next page"]').should('not.be.disabled').click();
  });
});
