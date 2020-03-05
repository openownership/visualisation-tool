import React, { Component } from "react";
import DagreGraph from "./dagre-d3-react";
import "./App.css";
import InlineSVG from "svg-inline-react";
import svg from "./svg";


const jointOwn = require("./fixtures/joint.json");
console.log(jointOwn);

const nodeConfig = {
  rx: 5,
  ry: 5,
  width: 150,
  height: 150
};

const getPersonNodes = bodsData => {
  return bodsData
    .filter(statement => statement.statementType === "personStatement")
    .map(statement => {
      const { statementID, names } = statement;
      return {
        id: statementID,
        label: `<div class="label-text">` + names[0].fullName + `</div>`,
        // '<img class="node-image" src="/assets/person.png"/><br>' +
        // "<span>" +
        // names[0].fullName +
        // "</span>",
        labelType: "html",
        class: "person",
        config: nodeConfig
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
        label: "<div>" + name + "</div>",
        // '<img class="node-image" src="/assets/ownerCompany.png"/><br>' +
        // "<span>" +
        // name +
        // "</span>",
        labelType: "html",
        class: "entity",
        config: nodeConfig
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
    <div>
      <h1>Dagre-D3 Demo</h1>
      <div className="dagre">
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
          shape="img"
          fitBoundaries
          zoomable
          onNodeClick={e => console.log(e)}
          onRelationshipClick={e => console.log(e)}
        />
      </div>
      <div>
        <InlineSVG src={svg} />
      </div>
    </div>
  );
}

export default App;
