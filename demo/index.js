import executeDraw from '../src/index';
import downloadSVG from '../src/utils/svgTools';

const getJSON = () => {
  var files = document.getElementById('selectFiles').files;
  console.log(files);
  if (files.length <= 0) {
    return false;
  }

  var fr = new FileReader();

  fr.onload = function (e) {
    console.log(e);
    var result = JSON.parse(e.target.result);
    var formatted = JSON.stringify(result, null, 2);
    document.getElementById('result').value = formatted;
  };

  fr.readAsText(files.item(0));
};

const visualiseData = () => {
  const data = JSON.parse(document.getElementById('result').value);
  executeDraw(data);
}

window.onload = () => {
  document.getElementById('svg_download').addEventListener('click', downloadSVG, true);
  document.getElementById('import').addEventListener('click', getJSON, true);
  document.getElementById('drawVis').addEventListener('click', visualiseData, true);
};
