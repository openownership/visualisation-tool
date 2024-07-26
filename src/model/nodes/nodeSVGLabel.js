const generateNodeLabel = (nodeText) => {
  const text_label = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const svg_label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  svg_label.setAttribute('x', 0);
  svg_label.setAttribute('y', 90);
  const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
  tspan.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
  tspan.textContent = nodeText;
  svg_label.appendChild(tspan);
  text_label.appendChild(svg_label);

  return text_label;
};

export default generateNodeLabel;
