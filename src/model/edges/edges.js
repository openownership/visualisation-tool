import { curveMonotoneX } from 'd3';
import latest from '../../utils/bods';

// This sets the style and shape of the edges using D3 parameters
const edgeConfig = {
  style: 'fill: none; stroke: #000; stroke-width: 5px;',
  curve: curveMonotoneX,
};

const defaultStroke = 5;

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
      return defaultStroke;
    }
  } else {
    return exact / 10;
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

export const checkInterests = (interestRelationship) => {
  return interestRelationship === 'indirect' || interestRelationship === 'unknown' ? true : false;
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

        if ('shareholding' in mappedInterests) {
          const arrowheadColour = shareStroke === 0 ? 'black' : '';
          const arrowheadShape = `${arrowheadColour}${'votingRights' in mappedInterests ? 'Half' : 'Full'}`;
          const strokeValue = shareStroke === 0 ? '#000' : '#652eb1';
          const positiveStroke = shareStroke === 0 ? 1 : shareStroke;

          edgeConfig.share = {
            arrowheadShape,
            strokeValue,
            positiveStroke,
          };
        }
        if ('votingRights' in mappedInterests) {
          const arrowheadColour = controlStroke === 0 ? 'black' : '';
          const arrowheadShape = `${arrowheadColour}${'votingRights' in mappedInterests ? 'Half' : 'Full'}`;
          const strokeValue = controlStroke === 0 ? '#000' : '#349aee';
          const positiveStroke = controlStroke === 0 ? 1 : controlStroke;

          edgeConfig.control = {
            arrowheadShape,
            strokeValue,
            positiveStroke,
          };
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
            interestedParty?.describedByPersonStatement ||
            interestedParty?.describedByEntityStatement ||
            'unknown',
          target: subject.describedByPersonStatement
            ? subject.describedByPersonStatement
            : subject.describedByEntityStatement,
          config: edgeConfig,
          replaces: replaces,
        };
      })
  );
};

export const getEdges = (data) => {
  const ownershipEdges = getOwnershipEdges(data);
  return { edges: [...ownershipEdges] };
};
