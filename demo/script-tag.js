var clearDrawing = function () {
  const svg = document.getElementById('bods-svg');
  if (svg) {
    svg.remove();
  }
};

var getJSON = function () {
  clearDrawing();
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

var visualiseData = function () {
  clearDrawing();
  var data = JSON.parse(document.getElementById('result').value);
  BODSDagre.draw(data, document.getElementById('svg-holder'), '/visualisation-tool/images');
};

window.onload = function () {
  document.getElementById('svg-clear').addEventListener('click', clearDrawing, true);
  document.getElementById('import').addEventListener('click', getJSON, true);
  document.getElementById('draw-vis').addEventListener('click', visualiseData, true);
};
