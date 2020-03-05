import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";

cytoscape.use(dagre);

const jointOwn = require("../fixtures/joint.json");
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
        data: {
          id: statementID,
          label: `<div class="label-text">` + names[0].fullName + `</div>`,
          labelType: "html",
          class: "person",
          config: nodeConfig
        }
      };
    });
};

const getEntityNodes = bodsData => {
  return bodsData
    .filter(statement => statement.statementType === "entityStatement")
    .map(statement => {
      const { statementID, name } = statement;
      return {
        data: {
          id: statementID,
          label: "<div>" + name + "</div>",
          labelType: "html",
          class: "entity",
          config: nodeConfig
        }
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
        data: {
          id: statementID,
          label: interests[0] ? interests[0].share.exact : "Unknown",
          source: interestedParty.describedByPersonStatement
            ? interestedParty.describedByPersonStatement
            : interestedParty.describedByEntityStatement,
          target: subject.describedByPersonStatement
            ? subject.describedByPersonStatement
            : subject.describedByEntityStatement
        }
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

var cy = cytoscape({
  container: document.getElementById("cy"),

  boxSelectionEnabled: false,
  autounselectify: true,

  style: cytoscape
    .stylesheet()
    .selector("node")
    .css({
      height: 80,
      width: 80,
      "background-fit": "cover",
      "border-color": "#000",
      "border-width": 3,
      "border-opacity": 0.5
    })
    .selector(".eating")
    .css({
      "border-color": "red"
    })
    .selector(".eater")
    .css({
      "border-width": 9
    })
    .selector("edge")
    .css({
      "curve-style": "bezier",
      width: 6,
      "target-arrow-shape": "triangle",
      "line-color": "#ffaaaa",
      "target-arrow-color": "#ffaaaa"
    })
    .selector("#bird")
    .css({
      "background-image":
        "https://live.staticflickr.com/7272/7633179468_3e19e45a0c_b.jpg"
    })
    .selector("#cat")
    .css({
      "background-image":
        "https://live.staticflickr.com/1261/1413379559_412a540d29_b.jpg"
    })
    .selector("#ladybug")
    .css({
      "background-image":
        "https://live.staticflickr.com/3063/2751740612_af11fb090b_b.jpg"
    })
    .selector("#aphid")
    .css({
      "background-image":
        "https://live.staticflickr.com/8316/8003798443_32d01257c8_b.jpg"
    })
    .selector("#rose")
    .css({
      "background-image":
        "https://live.staticflickr.com/5109/5817854163_eaccd688f5_b.jpg"
    })
    .selector("#grasshopper")
    .css({
      "background-image":
        "https://live.staticflickr.com/6098/6224655456_f4c3c98589_b.jpg"
    })
    .selector("#plant")
    .css({
      "background-image":
        "https://live.staticflickr.com/3866/14420309584_78bf471658_b.jpg"
    })
    .selector("#wheat")
    .css({
      "background-image":
        "https://live.staticflickr.com/2660/3715569167_7e978e8319_b.jpg"
    }),

  elements: {
    nodes,
    edges
  },

  layout: {
    name: "breadthfirst",
    directed: true,
    padding: 10
  }
}); // cy init

cy.on("tap", "node", function() {
  var nodes = this;
  var tapped = nodes;
  var food = [];

  nodes.addClass("eater");

  for (;;) {
    var connectedEdges = nodes.connectedEdges(function(el) {
      return !el.target().anySame(nodes);
    });

    var connectedNodes = connectedEdges.targets();

    Array.prototype.push.apply(food, connectedNodes);

    nodes = connectedNodes;

    if (nodes.empty()) {
      break;
    }
  }

  var delay = 0;
  var duration = 500;
  for (var i = food.length - 1; i >= 0; i--) {
    (function() {
      var thisFood = food[i];
      var eater = thisFood
        .connectedEdges(function(el) {
          return el.target().same(thisFood);
        })
        .source();

      thisFood
        .delay(delay, function() {
          eater.addClass("eating");
        })
        .animate(
          {
            position: eater.position(),
            css: {
              width: 10,
              height: 10,
              "border-width": 0,
              opacity: 0
            }
          },
          {
            duration: duration,
            complete: function() {
              thisFood.remove();
            }
          }
        );

      delay += duration;
    })();
  } // for
}); // on tap
