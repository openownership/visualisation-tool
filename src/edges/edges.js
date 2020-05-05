import generateEdgeLabel from "./edgeHTMLLabel";
// import generateEdgeLabel from "./edgeSVGLabel";
import * as d3 from "d3";

const edgeConfig = {
  // labeloffset: -100,
  // labelType: "html",
  // style: "fill: none; stroke: #000; stroke-width: 1px;",
  curve: d3.curveNatural,
  // lineInterpolate: 'basis'
};

// const getNested = (obj, ...args) => {
//   return args.reduce((obj, level) => obj && obj[level], obj);
// };

const getInterests = (interests) => {  
  const data = { ...interests
      .reduce((data, interest) => {
        const { type, share } = interest;
        const typeKey = (type === "voting-rights") ? "votingRights" : type;
        return {...data, [typeKey]: share }
      }, {})
  }

  return data;

  // const shareExact = getNested(interests[0], "share", "exact");
  // const shareMin = getNested(interests[0], "share", "minimum");
  // const shareMax = getNested(interests[0], "share", "maximum");
  // const controlExact = getNested(interests[0], "share", "exact");
  // const controlMin = getNested(interests[0], "share", "minimum");
  // const controlMax = getNested(interests[0], "share", "maximum");

  // const shares =
  //   shareExact !== undefined
  //     ? { share: { shareExact } }
  //     : shareMin !== undefined && shareMax !== undefined
  //     ? { share: { shareMin, shareMax } }
  //     : { share: None };

  // const control =
  //   controlExact !== undefined
  //     ? { control: { controlExact } }
  //     : controlMin !== undefined && controlMax !== undefined
  //     ? { control: { controlMin, controlMax } }
  //     : { control: null };

  //   return {...shares, ...control}
};

// const getEdgeLabel = (type) => {
//   return type === "influence-or-control" ? "Controls" : "Owns";
// };

// const generateLabelText = nodeText => {
//   const labelText = document.createElementNS("http://www.w3.org/2000/svg", "g");
//   const svg_text = document.createElementNS(
//     "http://www.w3.org/2000/svg",
//     "text"
//   );
//   labelText.setAttribute("class", "labelText");
//   const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
//   tspan.setAttributeNS(
//     "http://www.w3.org/XML/1998/namespace",
//     "xml:space",
//     "preserve"
//   );
//   tspan.setAttribute("dy", "1em");
//   tspan.setAttribute("x", "160");
//   tspan.setAttribute("y", "70");
//   tspan.textContent = nodeText;
//   svg_text.appendChild(tspan);
//   labelText.append(svg_text);
//   return labelText;
// };

// console.log(generateLabelText('apples'));

export const getOwnershipEdges = (bodsData) => {
  return bodsData
    .filter(
      (statement) => statement.statementType === "ownershipOrControlStatement"
    )
    .map((statement) => {
      const { statementID, subject, interestedParty, interests } = statement;

      // const interestType =
      //   getNested(interests[0], "type") === undefined
      //     ? ""
      //     : getNested(interests[0], "type");
      // const ownershipShare = getShare(interests);

      // console.log(generateEdgeLabel(`${getEdgeLabel(interestType)} ${ownershipShare}%`));

      return {
        id: statementID,
        // label: generateEdgeLabel(`${getEdgeLabel(interestType)} ${ownershipShare}%`),
        interests: getInterests(interests),
        source: interestedParty.describedByPersonStatement
          ? interestedParty.describedByPersonStatement
          : interestedParty.describedByEntityStatement
          ? interestedParty.describedByEntityStatement
          : "unknown",
        target: subject.describedByPersonStatement
          ? subject.describedByPersonStatement
          : subject.describedByEntityStatement,
        config: edgeConfig,
      };
    });
};
