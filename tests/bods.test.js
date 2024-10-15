import { latest } from '../src/utils/bods.js';

import testData from './__mocks__/dataMock.json';

describe('latest()', () => {
  it('should not throw an error when called', () => {
    const data = testData;
    const closedRecords = new Set();
    const version = '0.4';
    const result = () => latest(data, closedRecords, version);
    expect(result).not.toThrow();
  });

  it('should return data in the correct format', () => {
    const data = testData;
    const closedRecords = new Set();
    const version = '0.4';
    const statements = {
      declarationSubject: expect.anything(),
      publicationDetails: expect.any(Object),
      recordDetails: expect.any(Object),
      recordId: expect.anything(),
      recordStatus: expect.anything(),
      recordType: expect.anything(),
      statementDate: expect.anything(),
      statementId: expect.anything(),
    };
    const result = latest(data, closedRecords, version);
    expect(result[0]).toEqual(expect.objectContaining(statements));
  });
});
