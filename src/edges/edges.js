import * as d3 from 'd3';
import latest from '../utils/bods';

const edgeConfig = {
  style: 'fill: none; stroke: #000; stroke-width: 5px;',
  curve: d3.curveMonotoneX,
};

const endedEdgeConfig = {
  style: 'fill: none; stroke: #000; stroke-width: 5px; stroke-opacity: 0.25;',
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

        const mappedInterests = getInterests(interests);

        // work out the ownership stroke and text
        const { shareholding, votingRights } = mappedInterests;
        let shareStroke = 5;
        let shareText = '';
        if (shareholding) {
          const { exact: shareExact, minimum: shareMin, maximum: shareMax } = {
            ...shareholding,
          };
          shareStroke = (shareExact === undefined ? (shareMin + shareMax) / 2 : shareExact) / 10;
          shareText = `Owns ${shareExact === undefined ? `${shareMin} - ${shareMax}` : shareExact}%`;
        }

        // work out the control stroke and text
        let controlStroke = 5;
        let controlText = '';
        if (votingRights) {
          const { exact: controlExact, minimum: controlMin, maximum: controlMax } = {
            ...votingRights,
          };
          controlStroke = (controlExact === undefined ? (controlMin + controlMax) / 2 : controlExact) / 10;
          controlText = `Controls ${
            controlExact === undefined ? `${controlMin} - ${controlMax}` : controlExact
          }%`;
        }

        return {
          id: statementID,
          interests: mappedInterests,
          interestRelationship,
          controlStroke,
          controlText,
          shareText,
          shareStroke,
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
