import { parse } from '../src/parse/parse.js';

describe('parse()', () => {
  it('should return stringified, formatted JSON', () => {
    const data = `[{"test": "test"}]`;
    const parsedData = JSON.parse(data);
    const formattedData = JSON.stringify(parsedData, null, 2);
    const result = parse(data);
    expect(result.formatted).toEqual(formattedData);
  });

  it('should return parsed JSON', () => {
    const data = `[{"test": "test"}]`;
    const parsedData = JSON.parse(data);
    const result = parse(data);
    expect(result.parsed).toEqual(parsedData);
  });

  it('should throw an error if the input data is not valid JSON', () => {
    const data = '@';
    const result = () => JSON.parse(data);
    expect(result).toThrow();
  });
});
