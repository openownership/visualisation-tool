/**
 * @jest-environment jsdom
 */

import { getPersonNodes, getEntityNodes, findMatchingStatement, getNodes } from '../src/model/nodes/nodes.js';

import edges from './__mocks__/edgeMock.js';
import testData from './__mocks__/dataMock.json';

describe('getPersonNodes()', () => {
  it('should not throw an error when called', () => {
    const data = testData;
    const result = () => getPersonNodes(data);
    expect(result).not.toThrow();
  });
});

describe('getEntityNodes()', () => {
  it('should not throw an error when called', () => {
    const data = testData;
    const result = () => getEntityNodes(data);
    expect(result).not.toThrow();
  });
});

describe('findMatchingStatement()', () => {
  it('should not throw an error when called', () => {
    const data = testData;
    const id = '10478c6cf6de';
    const result = () => findMatchingStatement(data, id);
    expect(result).not.toThrow();
  });
});

describe('getNodes()', () => {
  it('should not throw an error when called', () => {
    const data = testData;
    const result = () => getNodes(data, edges);
    expect(result).not.toThrow();
  });

  it('should contain a nodes property', () => {
    const data = testData;
    const nodes = getNodes(data, edges);
    expect(nodes.nodes).toBeDefined();
  });
});
