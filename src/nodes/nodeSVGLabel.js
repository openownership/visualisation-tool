const generateLabelImage = nodeType => {
  const labelImage = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  const nodeSVG = document.getElementById(`${nodeType}NodeSVG`);
  const svgChildren = [...nodeSVG.children];
  labelImage.setAttribute("class", "labelImage");
  svgChildren.forEach(element => {
    const clone = element.cloneNode(true);
    labelImage.appendChild(clone);
  });
  return labelImage;
};

const generateLabelText = nodeText => {
  const labelText = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const svg_text = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  labelText.setAttribute("class", "labelText");
  const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
  tspan.setAttributeNS(
    "http://www.w3.org/XML/1998/namespace",
    "xml:space",
    "preserve"
  );
  tspan.setAttribute("dy", "1em");
  tspan.setAttribute("x", "0");
  tspan.setAttribute("y", "160");
  // tspan.setAttribute('dominant-baseline', "middle")
  // tspan.setAttribute('text-anchor', "middle")
  tspan.textContent = nodeText;
  svg_text.appendChild(tspan);
  labelText.append(svg_text);
  return labelText;
};

const generateNodeLabel = (nodeType, nodeText) => {
  const svg_label = document.createElementNS("http://www.w3.org/2000/svg", "g");
  // svg_label.setAttribute("x", "150");
  // svg_label.setAttribute('y', '150');
  svg_label.appendChild(generateLabelImage(nodeType));
  svg_label.appendChild(generateLabelText(nodeText));
  return svg_label;
};

export default generateNodeLabel;
