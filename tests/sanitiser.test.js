import sanitiser from '../src/utils/sanitiser.js';

describe('Sanitiser', () => {
  it('should escape dangerous characters from strings', () => {
    const dangerousString = `&<>"'/`;
    const escapedString = '&amp;&lt;&gt;&quot;&#x27;&#x2F;';
    const result = sanitiser(dangerousString);
    expect(result).toEqual(escapedString);
  });

  it('should not escape alphanumeric values from strings', () => {
    const testString = `abc123`;
    const result = sanitiser(testString);
    expect(result).toEqual(testString);
  });

  it('should coerce non-string values to strings', () => {
    const testValue = 123;
    const testValueToString = '123';
    const result = sanitiser(testValue);
    expect(result).toEqual(testValueToString);
  });

  it('should return an error if not provided with any value', () => {
    const resultFunction = () => {
      sanitiser();
    };
    expect(resultFunction).toThrow();
  });
});
