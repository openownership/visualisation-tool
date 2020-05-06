// WIP and untested

const generateLabelText = (nodeText) => {
  const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const svg_text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  labelText.setAttribute('class', 'labelText');
  const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
  tspan.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
  tspan.setAttribute('dy', '1em');
  tspan.textContent = nodeText;
  svg_text.appendChild(tspan);
  labelText.append(svg_text);
  return labelText;
};

const generateEdgeLabel = (nodeType, nodeText) => {
  const svg_label = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  svg_label.appendChild(generateLabelText(ownText));
  svg_label.appendChild(generateLabelText(controlText));
  return svg_label;
};

export default generateEdgeLabel;
