import React from "react";
import DagreGraph from "./dagre-d3-react";
import "./App.css";

const jointOwn = require("./fixtures/joint.json");
console.log(jointOwn);

const personConfig = {
  rx: 5,
  ry: 5,
  width: 150
};

const getPersonNodes = bodsData => {
  return bodsData
    .filter(statement => statement.statementType === "personStatement")
    .map(statement => {
      const { statementID, names } = statement;
      return {
        id: statementID,
        label:
          '<img class="node-image" src="/assets/person.png"/><br>' +
          "<b>" +
          names[0].fullName +
          "</b>",
        labelType: "html",
        class: "person",
        config: personConfig
      };
    });
};

const getEntityNodes = bodsData => {
  return bodsData
    .filter(statement => statement.statementType === "entityStatement")
    .map(statement => {
      const { statementID, name } = statement;
      return {
        id: statementID,
        label:
          '<img class="node-image" src="/assets/ownerCompany.png"/><br>' +
          "<b>" +
          name +
          "</b>",
        labelType: "html",
        class: "entity"
      };
    });
};

const getOwnershipEdges = bodsData => {
  return bodsData
    .filter(
      statement => statement.statementType === "ownershipOrControlStatement"
    )
    .map(statement => {
      const { statementID, subject, interestedParty, interests } = statement;
      console.log(statementID, interests);

      return {
        id: statementID,
        label: interests[0] ? interests[0].share.exact : "Unknown",
        source: interestedParty.describedByPersonStatement
          ? interestedParty.describedByPersonStatement
          : interestedParty.describedByEntityStatement,
        target: subject.describedByPersonStatement
          ? subject.describedByPersonStatement
          : subject.describedByEntityStatement
      };
    });
};

const personNodes = getPersonNodes(jointOwn);
const entityNodes = getEntityNodes(jointOwn);
const ownershipEdge = getOwnershipEdges(jointOwn);
console.log(personNodes);
console.log(entityNodes);
console.log(ownershipEdge);

const nodes = [...personNodes, ...entityNodes];
const edges = [...ownershipEdge];

console.log(nodes);
console.log(edges);

function App() {
  return (
    <div className="App">
      <DagreGraph
        nodes={nodes}
        links={edges}
        options={{
          rankdir: "LR",
          align: "UL",
          ranker: "tight-tree"
        }}
        width="500"
        height="500"
        animate={1000}
        shape="circle"
        fitBoundaries
        zoomable
        onNodeClick={e => console.log(e)}
        onRelationshipClick={e => console.log(e)}
      />
    </div>
  );
}

export default App;
