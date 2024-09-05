import { compareVersions } from 'compare-versions';
import { curveMonotoneX } from 'd3';
import { closedRecords, latest } from '../../utils/bods';
import interestTypesCodelist from '../../codelists/interestTypes';

// This sets the style and shape of the edges using D3 parameters
const edgeConfig = {
  style: 'fill: none; stroke: #000; stroke-width: 5px;',
  curve: curveMonotoneX,
};

const defaultStroke = 5;

const getInterests = (interests) => {
  const transformedInterests = interests.reduce((acc, interest) => {
    const { type, share, endDate } = interest;
    const typeKey = type;
    const typeCategory = interestTypesCodelist[type]?.category || '';

    const transformedInterest = {
      type: typeKey,
      share,
      category: typeCategory,
    };

    // Add the transformed object to the array
    acc.push(transformedInterest);
    return acc;
  }, []);

  return !interests ? [] : transformedInterests;
};

const getStroke = (shareValues) => {
  const { exact, minimum, exclusiveMinimum, maximum, exclusiveMaximum } = shareValues?.share || {};
  if (exact === undefined) {
    if (
      (minimum !== undefined || exclusiveMinimum !== undefined) &&
      (maximum !== undefined || exclusiveMaximum !== undefined)
    ) {
      return ((minimum || exclusiveMinimum) + (maximum || exclusiveMaximum)) / 2 / 10;
    } else {
      return defaultStroke;
    }
  } else {
    return exact / 10;
  }
};

const getText = (shareValues, type) => {
  const { exact, minimum, exclusiveMinimum, maximum, exclusiveMaximum } = shareValues?.share || {};
  if (exact === undefined) {
    if (
      (minimum !== undefined || exclusiveMinimum !== undefined) &&
      (maximum !== undefined || exclusiveMaximum !== undefined)
    ) {
      return `${type} ${minimum || exclusiveMinimum} - ${maximum || exclusiveMaximum}%`;
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
  const version = bodsData[0]?.publicationDetails?.bodsVersion || '0';

  const filteredData = bodsData.filter((statement) => {
    if (compareVersions(version, '0.4') >= 0) {
      return statement.recordType === 'relationship';
    } else {
      return statement.statementType === 'ownershipOrControlStatement';
    }
  });

  const mappedData = filteredData.map((statement) => {
    const {
      statementID = null,
      statementId = null,
      statementDate = null,
      recordId = null,
      recordStatus,
      recordDetails = null,
      subject,
      interestedParty,
      interests,
    } = statement;
    const replaces = statement.replacesStatements ? statement.replacesStatements : [];

    const interestsData = recordDetails?.interests || interests;
    const { interestLevel, directOrIndirect } = interestsData
      ? interestsData[0] || { interestLevel: 'unknown' }
      : { interestLevel: 'unknown' };

    // this accounts for changes from 0.2 to 0.3 (interestLevel renamed to directOrIndirect)
    const interestRelationship = interestLevel
      ? interestLevel
      : directOrIndirect
      ? directOrIndirect
      : 'unknown';
    let source, target;
    if (compareVersions(version, '0.4') >= 0) {
      source = recordDetails.interestedParty;
      target = recordDetails.subject;
    } else {
      source =
        interestedParty?.describedByPersonStatement ||
        interestedParty?.describedByEntityStatement ||
        'unknown';
      target = subject.describedByPersonStatement
        ? subject.describedByPersonStatement
        : subject.describedByEntityStatement;
    }

    const mappedInterests = getInterests(interestsData);

    // work out the ownership stroke and text
    const shareStroke = getStroke(mappedInterests.find((item) => item.type === 'shareholding'));
    const shareText = getText(
      mappedInterests.find((item) => item.type === 'shareholding'),
      'Owns'
    );

    const controlStroke = getStroke(mappedInterests.find((item) => item.type === 'votingRights'));
    const controlText = getText(
      mappedInterests.find((item) => item.type === 'votingRights'),
      'Controls'
    );

    if (mappedInterests.some((item) => item.category === 'ownership')) {
      const arrowheadColour = shareStroke === 0 ? 'black' : '';
      const arrowheadShape = `${arrowheadColour}${
        mappedInterests.some((item) => item.category === 'control') ? 'Half' : 'Full'
      }`;
      const strokeValue = shareStroke === 0 ? '#000' : '#652eb1';
      const positiveStroke = shareStroke === 0 ? 1 : shareStroke;

      edgeConfig.share = {
        arrowheadShape,
        strokeValue,
        positiveStroke,
      };
    }
    if (mappedInterests.some((item) => item.category === 'control')) {
      const arrowheadColour = controlStroke === 0 ? 'black' : '';
      const arrowheadShape = `${arrowheadColour}${
        mappedInterests.some((item) => item.category === 'ownership') ? 'Half' : 'Full'
      }`;
      const strokeValue = controlStroke === 0 ? '#000' : '#349aee';
      const positiveStroke = controlStroke === 0 ? 1 : controlStroke;

      edgeConfig.control = {
        arrowheadShape,
        strokeValue,
        positiveStroke,
      };
    }

    return {
      id: statementId || statementID,
      statementDate,
      recordId,
      recordStatus,
      interests: mappedInterests,
      interestRelationship,
      controlStroke,
      controlText,
      shareText,
      shareStroke,
      source,
      target,
      config: { ...edgeConfig },
      replaces: replaces,
      fullDescription: statement,
      description: {
        statementDate,
        recordId,
        interests: recordDetails?.interests || interests || [],
      },
    };
  });

  return latest(mappedData, closedRecords, version);
};

export const getEdges = (data) => {
  const ownershipEdges = getOwnershipEdges(data);
  return { edges: [...ownershipEdges] };
};
