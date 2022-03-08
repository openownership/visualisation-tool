import * as d3 from 'd3';
import latest from '../utils/bods';

const edgeConfig = {
  style: 'fill: none; stroke: #000; stroke-width: 1px;',
  curve: d3.curveMonotoneX,
};

const endedEdgeConfig = {
  style: 'fill: none; stroke: #000; stroke-width: 1px; stroke-opacity: 0.25;',
  curve: d3.curveMonotoneX,
};

const getInterests = (interests) => {
  if (!interests) {
    return {};
  }
  const data = {
    ...interests.reduce((data, interest) => {
      const { type, share, endDate } = interest;
      const typeKey = type === 'voting-rights' ? 'votingRights' : type;
      if (share) {
        share.ended = endDate ? true : false;
      }
      return { ...data, [typeKey]: share };
    }, {}),
  };

  return data;
};

export const getOwnershipEdges = (bodsData) => {
  return latest(
    bodsData
      .filter((statement) => statement.statementType === 'ownershipOrControlStatement')
      .map((statement) => {
        const { statementID, subject, interestedParty, interests } = statement;
        const replaces = statement.replacesStatements ? statement.replacesStatements : [];
        const { interestLevel, directOrIndirect } = interests[0] || { interestLevel: 'unknown' };
        // this accounts for changes from 0.2 to 0.3 (interestLevel renamed to directOrIndirect)
        const interestRelationship = interestLevel
          ? interestLevel
          : directOrIndirect
          ? directOrIndirect
          : 'direct';
        return {
          id: statementID,
          interests: getInterests(interests),
          interestRelationship,
          source:
            interestedParty.describedByPersonStatement ||
            interestedParty.describedByEntityStatement ||
            'unknown',
          target: subject.describedByPersonStatement
            ? subject.describedByPersonStatement
            : subject.describedByEntityStatement,
          config: interests && interests.every((i) => i.endDate) ? endedEdgeConfig : edgeConfig,
          replaces: replaces,
        };
      })
  );
};
