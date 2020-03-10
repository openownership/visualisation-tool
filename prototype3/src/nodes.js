import * as d3 from "d3";
import { personSVG } from "./svg";

const nodeConfig = {
  rx: 10,
  ry: 10
};

const generateLabelImage = nodeType => {
  const labelImage = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  const nodeSVG = document.getElementById(`${nodeType}NodeSVG`);
  const svgChildren = [...nodeSVG.children];
  labelImage.setAttribute("class", "labelImage");
  svgChildren.forEach(element => {
    const clone = element.cloneNode();
    labelImage.appendChild(clone);
  });
  return labelImage;
};

const generateLabelText = nodeText => {
  const labelText = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
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
  tspan.setAttribute("x", "160");
  tspan.setAttribute("y", "70");
  tspan.textContent = nodeText;
  svg_text.appendChild(tspan);
  labelText.append(svg_text);
  return labelText;
};

const generateNodeLabel = (nodeType, nodeText) => {
  const svg_label = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg_label.appendChild(generateLabelImage(nodeType));
  svg_label.appendChild(generateLabelText(nodeText));
  return svg_label;
};

export const getPersonNodes = bodsData => {
  return bodsData
    .filter(statement => statement.statementType === "personStatement")
    .map(statement => {
      const { statementID, names } = statement;
      return {
        id: statementID,
        label: generateNodeLabel("person", names[0].fullName),
        labelType: "svg",
        class: "person",
        config: nodeConfig
      };
    });
};

export const getEntityNodes = bodsData => {
  return bodsData
    .filter(statement => statement.statementType === "entityStatement")
    .map(statement => {
      const { statementID, name } = statement;
      return {
        id: statementID,
        label: generateNodeLabel("entity", name),
        labelType: "svg",
        class: "entity",
        config: nodeConfig
      };
    });
};
