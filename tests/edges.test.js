import { checkInterests, getOwnershipEdges, getEdges } from '../src/model/edges/edges.js';

import testData from './__mocks__/dataMock.json';

describe('checkInterests()', () => {
  it('should not throw an error when called', () => {
    const relationship = '';
    const result = () => checkInterests(relationship);
    expect(result).not.toThrow();
  });
});

describe('getOwnershipEdges()', () => {
  it('should not throw an error when called', () => {
    const data = testData;
    const result = () => getOwnershipEdges(data);
    expect(result).not.toThrow();
  });
});

describe('getEdges()', () => {
  it('should not throw an error when called', () => {
    const data = testData;
    const result = () => getEdges(data);
    expect(result).not.toThrow();
  });

  it('should contain an edges property', () => {
    const data = testData;
    const edges = getEdges(data);
    expect(edges.edges).toBeDefined();
  });
});
