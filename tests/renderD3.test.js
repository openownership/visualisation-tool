/**
 * @jest-environment jsdom
 */
import fs from 'fs';
import path from 'path';

import { setupD3 } from '../src/render/renderD3.js';

const html = fs.readFileSync(path.resolve(__dirname, '../demo/index.html'), 'utf8');

describe('setupD3()', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
  });

  it('should return an svg selection', () => {
    const id = 'svg-holder';

    const element = document.querySelector(`#${id}`);
    const { svg } = setupD3(element);

    expect(svg.node().nodeName).toEqual('svg');
  });

  it('should return an svg group selection', () => {
    const id = 'svg-holder';

    const element = document.querySelector(`#${id}`);
    const { inner } = setupD3(element);

    expect(inner.node().nodeName).toEqual('g');
  });
});
