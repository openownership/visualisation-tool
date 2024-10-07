import testData from '../fixtures/testData.json';

describe('draw()', () => {
  it('renders an svg without errors', () => {
    cy.visit('../../demo-build/index.html');
    cy.get('textarea').clear();
    cy.get('textarea').type(JSON.stringify(testData), { parseSpecialCharSequences: false });
    cy.get('#draw-vis').click();

    cy.get('#bods-svg').contains('Profitech Ltd');
  });
});
