import sanitiser from '../src/utils/sanitiser.js';

describe('Sanitiser', () => {
  it('removes dangerous characters from strings', () => {
    const result = sanitiser('<>');
    expect(result).not.toEqual('<>');
  });
});
