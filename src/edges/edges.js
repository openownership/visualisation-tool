import * as d3 from 'd3';

const edgeConfig = {
  style: 'fill: none; stroke: #000; stroke-width: 1px;',
  curve: d3.curveMonotoneX,
};

const getInterests = (interests) => {
  const data = {
    ...interests.reduce((data, interest) => {
      const { type, share } = interest;
      const typeKey = type === 'voting-rights' ? 'votingRights' : type;
      return { ...data, [typeKey]: share };
    }, {}),
  };

  return data;
};

export const getOwnershipEdges = (bodsData) => {
  return bodsData
    .filter((statement) => statement.statementType === 'ownershipOrControlStatement')
    .map((statement) => {
      const { statementID, subject, interestedParty, interests } = statement;

      return {
        id: statementID,
        interests: getInterests(interests),
        source: interestedParty.describedByPersonStatement
          ? interestedParty.describedByPersonStatement
          : interestedParty.describedByEntityStatement
          ? interestedParty.describedByEntityStatement
          : 'unknown',
        target: subject.describedByPersonStatement
          ? subject.describedByPersonStatement
          : subject.describedByEntityStatement,
        config: edgeConfig,
      };
    });
};
