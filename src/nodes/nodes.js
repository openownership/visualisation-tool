// import generateNodeLabel from './nodeSVGLabel';
import generateNodeLabel from './nodeHTMLLabel';

const unknownNode = [
  {
    statementID: "unknown",
    statementType: "personStatement",
    names: [{ fullName: "Unknown" }]
  }
];

const nodeConfig = {
  shape: "circle",
  width: 100,
  style: "opacity: 0; fill: #f7f7f7; stroke: #444; stroke-width: 1px;",
};

export const getPersonNodes = bodsData => {
  return bodsData
    .filter(statement => statement.statementType === "personStatement")
    .map(statement => {
      const { statementID, names } = statement;
      const nodeType = statementID === "unknown" ? "unknown" : "person";
      return {
        id: statementID,
        label: generateNodeLabel(nodeType, names[0].fullName),
        labelType: "html",
        class: nodeType,
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
        labelType: "html",
        class: "entity",
        config: nodeConfig
      };
    });
};

export const setUnknownNode = () => getPersonNodes(unknownNode);
