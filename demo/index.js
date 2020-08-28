import executeDraw from '../src/index';
import { clearSVG } from '../src/utils/svgTools';
import './demo.css';

const getJSON = () => {
  clearSVG();
  var files = document.getElementById('selectFiles').files;
  if (files.length <= 0) {
    return false;
  }

  var fr = new FileReader();

  fr.onload = function (e) {
    var result = JSON.parse(e.target.result);
    var formatted = JSON.stringify(result, null, 2);
    document.getElementById('result').value = formatted;
    visualiseData();
  };

  fr.readAsText(files.item(0));
};

const visualiseData = () => {
  clearSVG();
  const data = JSON.parse(document.getElementById('result').value);
  executeDraw(data);
};

window.onload = () => {
  document.getElementById('svg-clear').addEventListener('click', clearSVG, true);
  document.getElementById('import').addEventListener('click', getJSON, true);
  document.getElementById('draw-vis').addEventListener('click', visualiseData, true);
};
