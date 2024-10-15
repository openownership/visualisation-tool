/**
 * @jest-environment jsdom
 */

import { getPersonNodes, getEntityNodes, findMatchingStatement, getNodes } from '../src/model/nodes/nodes.js';

import testEdges from './__mocks__/edgeMock.js';
import testData from './__mocks__/dataMock.json';

describe('getPersonNodes()', () => {
  it('should not throw an error when called', () => {
    const data = testData;
    const result = () => getPersonNodes(data);
    expect(result).not.toThrow();
  });

  it('should return data in the correct format', () => {
    const data = testData;
    const keys = [
      'class',
      'config',
      'countryCode',
      'description',
      'fullDescription',
      'id',
      'label',
      'labelType',
      'nodeType',
      'recordId',
      'replaces',
      'statementDate',
    ];
    const result = getPersonNodes(data);
    expect(result[0]).toContainKeys(keys);
  });
});

describe('getEntityNodes()', () => {
  it('should not throw an error when called', () => {
    const data = testData;
    const result = () => getEntityNodes(data);
    expect(result).not.toThrow();
  });

  it('should return data in the correct format', () => {
    const data = testData;
    const keys = [
      'class',
      'config',
      'countryCode',
      'description',
      'fullDescription',
      'id',
      'label',
      'labelType',
      'nodeType',
      'recordId',
      'replaces',
      'statementDate',
    ];
    const result = getPersonNodes(data);
    expect(result[0]).toContainKeys(keys);
  });
});

describe('findMatchingStatement()', () => {
  it('should not throw an error when called', () => {
    const data = testData;
    const id = '10478c6cf6de';
    const result = () => findMatchingStatement(data, id);
    expect(result).not.toThrow();
  });

  it('should return a matching statement given an id', () => {
    const data = [{ recordId: '123' }, { recordId: '456' }];
    const id = '123';
    const result = findMatchingStatement(data, id);
    expect(result).toEqual(data[0]);
  });
});

describe('getNodes()', () => {
  it('should not throw an error when called', () => {
    const data = testData;
    const edges = testEdges;
    const result = () => getNodes(data, edges);
    expect(result).not.toThrow();
  });

  it('should contain a "nodes" property', () => {
    const data = testData;
    const edges = testEdges;
    const nodes = getNodes(data, edges);
    expect(nodes.nodes).toBeDefined();
  });
});
