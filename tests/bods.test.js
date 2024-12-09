import { filteredData } from '../src/utils/bods.js';

import testData from './__mocks__/dataMock.json';

describe('filteredData()', () => {
  it('should not throw an error when called', () => {
    const data = testData;
    const version = '0.4';
    const result = () => filteredData(data, '2020-03-04', version);
    expect(result).not.toThrow();
  });

  it('should return data in the correct format', () => {
    const data = testData;
    const version = '0.4';
    const keys = [
      'declarationSubject',
      'publicationDetails',
      'recordDetails',
      'recordId',
      'recordStatus',
      'recordType',
      'statementDate',
      'statementId',
    ];
    const result = filteredData(data, '2020-03-04', version);
    expect(result[0]).toContainKeys(keys);
  });
});
