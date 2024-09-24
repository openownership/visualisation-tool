/**
 * @jest-environment jsdom
 */
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.resolve(__dirname, '../demo/index.html'), 'utf8');

describe('Initial HTML', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
  });

  it('should contain an svg element with id of "bods-svg"', () => {
    const id = 'bods-svg';
    const element = 'svg';

    const result = document.querySelector(`#${id}`);

    expect(result.id).toEqual(id);
    expect(result.nodeName).toEqual(element);
  });

  it('should contain an input field of type "file"', () => {
    const type = 'file';
    const element = 'input';

    const result = document.querySelector(`${element}[type="${type}"]`);

    expect(result).not.toBeNull();
  });

  it('should contain a button with id of "import"', () => {
    const id = 'import';
    const element = 'button';

    const result = document.querySelector(`${element}[id="${id}"]`);

    expect(result).not.toBeNull();
  });

  it('should contain a textarea field with id of "result"', () => {
    const id = 'result';
    const element = 'textarea';

    const result = document.querySelector(`${element}[id="${id}"]`);

    expect(result).not.toBeNull();
  });

  it('should contain a button with id of "draw-vis"', () => {
    const id = 'draw-vis';
    const element = 'button';

    const result = document.querySelector(`${element}[id="${id}"]`);

    expect(result).not.toBeNull();
  });

  it('should contain a button with id of "svg-clear"', () => {
    const id = 'svg-clear';
    const element = 'button';

    const result = document.querySelector(`${element}[id="${id}"]`);

    expect(result).not.toBeNull();
  });

  it('should contain a button with id of "zoom_in"', () => {
    const id = 'zoom_in';
    const element = 'button';

    const result = document.querySelector(`${element}[id="${id}"]`);

    expect(result).not.toBeNull();
  });

  it('should contain a button with id of "zoom_out"', () => {
    const id = 'zoom_out';
    const element = 'button';

    const result = document.querySelector(`${element}[id="${id}"]`);

    expect(result).not.toBeNull();
  });

  it('should contain a button with id of "download-svg"', () => {
    const id = 'download-svg';
    const element = 'button';

    const result = document.querySelector(`${element}[id="${id}"]`);

    expect(result).not.toBeNull();
  });

  it('should contain a button with id of "download-png"', () => {
    const id = 'download-png';
    const element = 'button';

    const result = document.querySelector(`${element}[id="${id}"]`);

    expect(result).not.toBeNull();
  });

  it('should contain an empty div with id of "disclosure-widget"', () => {
    const id = 'disclosure-widget';
    const element = 'div';

    const result = document.querySelector(`${element}[id="${id}"]`);

    expect(result).not.toBeNull();
    expect(result.innerHTML).toEqual('');
  });
});
