import { selectData } from '../src/index.js';
import { clearSVG } from '../src/utils/svgTools.js';
import { parse } from '../src/parse/parse.js';
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
  let data;
  var files = document.getElementById('selectFiles').files;

  if (files.length <= 0) {
    // Parse inline data
    data = parse(document.getElementById('result').value);
  } else {
    // Parse file data
    const file = await readFile(files.item(0));
    data = parse(file);
  }

  visualiseData(data);
};

const visualiseData = (data) => {
  // Render data as text
  if (data.formatted) {
    document.getElementById('result').value = data.formatted;
  }
  // Select data and render as graph
  selectData({
    data: data.parsed,
    container: document.getElementById('svg-holder'),
    imagesPath: 'images',
    labelLimit: 100,
    useTippy: true,
  });
};

window.onload = () => {
  document.getElementById('svg-clear').addEventListener('click', clearDrawing, true);
  document.getElementById('import').addEventListener('click', getJSON, true);
  document.getElementById('draw-vis').addEventListener('click', getJSON, true);
};
