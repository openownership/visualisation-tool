import sanitise from '../utils/sanitiser';

const generateNodeLabel = (nodeText) => {
  const sanitisedNodeText = sanitise(nodeText);
  const text_label = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const svg_label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  svg_label.setAttribute('x', 0);
  svg_label.setAttribute('y', 90);
  const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
  tspan.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
  const link = document.createElementNS('http://www.w3.org/2000/svg', 'a');
  link.setAttributeNS(
    'http://www.w3.org/1999/xlink',
    'xlink:href',
    `http://register.openownership.org/search?q=${sanitisedNodeText}`
  );
  link.setAttribute('target', '_blank');
  link.textContent = sanitisedNodeText;
  tspan.appendChild(link);
  svg_label.appendChild(tspan);
  text_label.appendChild(svg_label);

  return text_label;
};

export default generateNodeLabel;
