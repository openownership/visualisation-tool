const nodeConfig = {
    rx: 10,
    ry: 10,
    width: 150,
    height: 20
  };

export const getPersonNodes = bodsData => {
  return bodsData
    .filter(statement => statement.statementType === "personStatement")
    .map(statement => {
      const { statementID, names } = statement;
      return {
        id: statementID,
        label:
          "<div ref=" +
          statementID +
          '><img class="node-image" src="./public/assets/person.png"/>' +
          "<span>" +
          names[0].fullName +
          "</span></div>",
        labelType: "html",
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
        label:
          '<img class="node-image" src="./public/assets/ownerCompany.png"/>' +
          "<span>" +
          name +
          "</span>",
        labelType: "html",
        class: "entity",
        config: nodeConfig
      };
    });
};