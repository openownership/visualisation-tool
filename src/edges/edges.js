import * as d3 from 'd3';
import latest from '../utils/bods';

const EDGE_CONFIG = {
  style: 'fill: none; stroke: #000; stroke-width: 5px;',
  curve: d3.curveMonotoneX,
};

const DEFAULT_STROKE = 5;

const getInterests = (interests) => {
  return !interests
    ? {}
    : {
        ...interests.reduce((data, interest) => {
          const { type, share, endDate } = interest;
          const typeKey = type === 'voting-rights' ? 'votingRights' : type;
          return { ...data, [typeKey]: share };
        }, {}),
      };
};

const getStroke = (shareValues) => {
  const { exact, minimum, maximum } = shareValues || {};
  if (exact === undefined) {
    if (minimum !== undefined && maximum !== undefined) {
      return (minimum + maximum) / 2 / 10;
    } else {
      return DEFAULT_STROKE;
    }
  } else {
    return exact > 0 ? exact / 10 : 1;
  }
};

const getText = (shareValues, type) => {
  const { exact, minimum, maximum } = shareValues || {};
  if (exact === undefined) {
    if (minimum !== undefined && maximum !== undefined) {
      return `${type} ${minimum} - ${maximum}%`;
    } else {
      return ``;
    }
  } else {
    return `${type} ${exact}%`;
  }
};

export const getOwnershipEdges = (bodsData) => {
  return latest(
    bodsData
      .filter((statement) => statement.statementType === 'ownershipOrControlStatement')
      .map((statement) => {
        const { statementID, subject, interestedParty, interests } = statement;
        const replaces = statement.replacesStatements ? statement.replacesStatements : [];
        const { interestLevel, directOrIndirect } = interests
          ? interests[0] || { interestLevel: 'unknown' }
          : { interestLevel: 'unknown' };
        // this accounts for changes from 0.2 to 0.3 (interestLevel renamed to directOrIndirect)
        const interestRelationship = interestLevel
          ? interestLevel
          : directOrIndirect
          ? directOrIndirect
          : 'unknown';

        const mappedInterests = getInterests(interests);

        // work out the ownership stroke and text
        const { shareholding, votingRights } = mappedInterests;

        const shareStroke = getStroke(shareholding);
        const shareText = getText(shareholding, 'Owns');

        const controlStroke = getStroke(votingRights);
        const controlText = getText(votingRights, 'Controls');

        return {
          id: statementID,
          interests: mappedInterests,
          interestRelationship,
          controlStroke,
          controlText,
          shareText,
          shareStroke,
          source:
            interestedParty?.describedByPersonStatement ||
            interestedParty?.describedByEntityStatement ||
            'unknown',
          target: subject.describedByPersonStatement
            ? subject.describedByPersonStatement
            : subject.describedByEntityStatement,
          config: EDGE_CONFIG,
          replaces: replaces,
        };
      })
  );
};
