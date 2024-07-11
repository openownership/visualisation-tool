import { draw } from '../src/index';
import { clearSVG } from '../src/utils/svgTools';
import './demo.css';

const clearDrawing = () => {
  clearSVG(document.getElementById('svg-holder'));
};

// Read file asynchronously
const readFile = (file) => {
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = function (e) {
      resolve(e.target.result);
    };
    fr.readAsText(file);
  });
};

const getJSON = async () => {
  clearDrawing();
  const files = document.getElementById('selectFiles').files;
  if (files.length <= 0) {
    return false;
  }

  const file = await readFile(files.item(0));
  const result = JSON.parse(file);
  const formatted = JSON.stringify(result, null, 2);
  document.getElementById('result').value = formatted;
  visualiseData();
};

const visualiseData = () => {
  clearDrawing();
  const data = JSON.parse(document.getElementById('result').value);
  draw(data, document.getElementById('svg-holder'), 'images', 100);
};

window.onload = () => {
  document.getElementById('svg-clear').addEventListener('click', clearDrawing, true);
  document.getElementById('import').addEventListener('click', getJSON, true);
  document.getElementById('draw-vis').addEventListener('click', visualiseData, true);
};
