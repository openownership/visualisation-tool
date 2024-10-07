import fs from 'fs';
import path from 'path';

import { draw } from '../src/index.js';
import testData from './testData/bods-package.json';

const html = fs.readFileSync(path.resolve(__dirname, '../demo/index.html'), 'utf8');

describe('draw()', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
  });

  it('should render a graph without errors', () => {
    const graph = draw({
      data: testData,
      container: document.querySelector('#svg-holder'),
      imagesPath: 'images',
    });

    expect(graph).toThrowError();
  });
});
