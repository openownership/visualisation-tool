// import { draw } from '../src/index.js';
import testData from './testData/bods-package.json';

describe('draw()', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:9000');
  });

  it('should be titled "BODS Data Visualisation Demo"', async () => {
    await expect(page.title()).resolves.toEqual('BODS Data Visualisation Demo');
  });

  it('should produce an svg', async () => {
    const data = JSON.stringify(testData);
    const textarea = await page.locator('#result');
    await textarea.fill(data);

    await page.click('#draw-vis');

    const svg = await page.$eval('#bods-svg', (element) => element.innerText);
    expect(svg).toContain('Profitech Ltd');
  }, 60000);
});
// /**
//  * @jest-environment jsdom
//  */
// import fs from 'fs';
// import path from 'path';

// import { draw } from '../src/index.js';
// import testData from './testData/bods-package.json';

// const html = fs.readFileSync(path.resolve(__dirname, '../demo/index.html'), 'utf8');

// describe('draw()', () => {
//   beforeEach(() => {
//     document.documentElement.innerHTML = html.toString();
//   });

//   it('should render a graph without errors', async () => {
//     const container = document.querySelector('#svg-holder');

//     const graph = draw({
//       data: testData,
//       container,
//       imagesPath: 'images',
//     });

//     expect(graph).toThrowError();
//   });
// });
